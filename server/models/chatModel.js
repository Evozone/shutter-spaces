import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            required: true,
            unique: true,
        },
        userOne: {
            type: Object,
            required: true,
        },
        userTwo: {
            type: Object,
            required: true,
        },
        lastMessage: {
            type: String,
        },
        lastMessageTime: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Chat', chatSchema);
