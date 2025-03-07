import mongoose from "mongoose";

const chatModelSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        messages: [{
            body: {
                type: String,
                required: true
            },
            sentAt: {
                type: Date,
                default: Date.now()
            },
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true
            }
        }]
    },
    {
        timestamps: true
    }

)

const ChatModel = mongoose.models.chats || mongoose.model('chats', chatModelSchema)

export default ChatModel

