import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // it refers to User schema model id
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        }
    },
    { timestamps: true } //mongoose create createdAt updatedAt time automatically
)

const Message = mongoose.model("Message", messageSchema);

export default Message;