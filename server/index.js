// MERN package imports
import express from 'express';
import mongoose from 'mongoose';

// Helper packages
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 as uuid4 } from 'uuid';
import crypto from 'crypto';

// Socket.io imports
import { Server } from 'socket.io';

// API route imports
import userRouter from './routes/users.js';
import roomsRouter from './routes/rooms.js';
import cityRouter from './routes/cities.js';
import blogRouter from './routes/blogs.js';
import imageRouter from './routes/images.js';
import chatRouter from './routes/chats.js';
import messageRouter from './routes/messages.js';
import listingRouter from './routes/listings.js';

// App configs
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With, Content-Type, Authorization'
    );
    next();
});
app.use(express.json({ limit: '10MB' }));

// Routers
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/chats', chatRouter);
app.use('/api/cities', cityRouter);
app.use('/api/messages', messageRouter);
app.use('/api/images', imageRouter);
app.use('/api/listings', listingRouter);

// MongoDB connection
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log(`${error} did not connect`));

const server = app.listen(PORT, () =>
    console.log(
        "Hello! This is ShutterSpace's backend, listening on port - ",
        PORT
    )
);

// Socket.io configs
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_URL,
    },
});

// Socket.io connection for chat
let online_users = [];
const chat = io.of('/chat');
chat.on('connection', (socket) => {
    socket.on('join', ({ newUserId, onlineStatus }) => {
        if (!online_users.some((user) => user.userId === newUserId)) {
            online_users.push({
                userId: newUserId,
                socketId: socket.id,
                onlineStatus,
            });
            // console.log('New User Connected', online_users);
        }
        chat.emit('online_users', online_users);
    });

    socket.on('send_message', (data) => {
        const { receiverId, senderId } = data;
        const user = online_users.find((user) => user.userId === receiverId);
        const self = online_users.find((user) => user.userId === senderId);
        if (user) {
            chat.to(user.socketId).emit('recieve_message', data);
            chat.to(user.socketId).emit('recieve_notification', data);
        }
        if (self) {
            chat.to(self.socketId).emit('update_user_chats', data);
        }
    });

    socket.on('start_typing', (data) => {
        const { receiverId } = data;
        const user = online_users.find((user) => user.userId === receiverId);
        if (user) {
            chat.to(user.socketId).emit('typing_status', data);
        }
    });

    socket.on('stop_typing', (data) => {
        const { receiverId } = data;
        const user = online_users.find((user) => user.userId === receiverId);
        if (user) {
            chat.to(user.socketId).emit('typing_status', data);
        }
    });

    socket.on('disconnect', () => {
        online_users = online_users.filter(
            (user) => user.socketId !== socket.id
        );
        // console.log('User Disconnected', online_users);
        chat.emit('online_users', online_users);
    });
});

// Socket.io connection for personal call
let users = {};
let socketToRoom = {};
const maximum = 2;
const personal_call = io.of('/personalCall');
personal_call.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        if (users[data.roomId]) {
            const length = users[data.roomId].length;
            if (length === maximum) {
                personal_call.to(socket.id).emit('room_full');
                return;
            }
            users[data.roomId].push({ id: socket.id, name: data.name });
        } else {
            users[data.roomId] = [{ id: socket.id, name: data.name }];
        }
        socketToRoom[socket.id] = data.roomId;

        socket.join(data.roomId);
        // console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

        const remoteUser = users[data.roomId].filter(
            (user) => user.id !== socket.id
        );

        // console.log(remoteUser);
        // console.log('socket to room', socketToRoom);
        // console.log('users', users);

        personal_call.to(socket.id).emit('all_users', remoteUser);
        if (remoteUser.length === 1) {
            // console.log('send info of 2nd user to 1st user');
            personal_call
                .to(remoteUser[0].id)
                .emit('user_joined', { id: socket.id, name: data.name });
        }
    });

    socket.on('offer', ({ sdp, userId }) => {
        personal_call.to(userId).emit('getOffer', { sdp, userId: socket.id });
    });

    socket.on('answer', ({ sdp, userId }) => {
        // console.log(
        //     'answer: ' + socket.id + '  sdp : ' + sdp,
        //     '  roomId : ' + roomId
        // );
        personal_call.to(userId).emit('getAnswer', sdp);
    });

    socket.on('candidate', ({ candidate, roomId }) => {
        // console.log('candidate: ' + socket.id);
        // personal_call.to(userId).emit('getCandidate', candidate);
        socket.in(roomId).emit('getCandidate', candidate);
    });

    socket.on('toggle_audio', ({ roomId, audioMuted }) => {
        // console.log('toggle_audio: ' + socket.id);
        if (users[roomId]) {
            const remoteUser = users[roomId].filter(
                (user) => user.id !== socket.id
            );
            if (remoteUser.length > 0) {
                personal_call
                    .to(remoteUser[0].id)
                    .emit('toggle_audio', audioMuted);
            }
        }
    });

    socket.on('disconnect', () => {
        // console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
        const roomId = socketToRoom[socket.id];
        let room = users[roomId];
        if (room) {
            const userLeftInfo = room.filter((user) => user.id === socket.id);
            socket.in(roomId).emit('user_left', userLeftInfo[0]);
            room = room.filter((user) => user.id !== socket.id);
            if (room.length === 0) {
                delete users[roomId];
            } else {
                users[roomId] = room;
            }
        }
        delete socketToRoom[socket.id];
        // console.log(users);
    });
});

// HMS Token
app.get('/mtoken', (req, res) => {
    var app_access_key = process.env.HMS_ACCESS_KEY;
    var app_secret = process.env.HMS_SECRET_APP;
    try {
        const token = jwt.sign(
            {
                access_key: app_access_key,
                type: 'management',
                version: 2,
                iat: Math.floor(Date.now() / 1000) - 30,
                nbf: Math.floor(Date.now() / 1000) - 30,
            },
            app_secret,
            {
                algorithm: 'HS256',
                expiresIn: '1h',
                jwtid: uuid4(),
            }
        );
        res.status(200).json({
            success: true,
            data: {
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: { error },
        });
    }
});

// Agora Token for [???] @Chinu
app.get('/auth', (req, res) => {
    const privateKey = 'private_FcAC/N5RyIU4uPWUJhfPNKn8TY0=';
    const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
    const expire = now + 3400;
    const signature = crypto
        .createHmac('sha1', privateKey)
        .update(`${now}.${expire}` + expire)
        .digest('hex')
        .toLowerCase();

    const response = {
        signature,
        token: `${now}.${expire}`,
        expire,
    };

    res.json(response);
});

// Default route
app.get('/', (req, res) => {
    res.send("Hello, Welocme to ShutterSpace's API");
});
