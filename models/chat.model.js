import mongoose from "mongoose"

const ChatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: []
        }
    ]
}, { timestamps: true })

const Chat = mongoose.model("Chat", ChatSchema)
export default Chat