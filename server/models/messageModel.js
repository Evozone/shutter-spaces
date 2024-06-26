import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            required: true,
        },
        senderId: {
            type: String,
            required: true,
        },
        senderName: {
            type: String,
            required: true,
        },
        senderEmail: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        timestamp: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Message', messageSchema);
