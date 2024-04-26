import Conversation from "../models/conversationModel.js"
import Message from "../models/messageModel.js"
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params; //this id is receiverId from params
        const senderId = req.user._id; //this id is senderId from protectRoute

        //find previous conversation if there is any 
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        //if there is no conversation
        if (!conversation) {
            //creating new conversation
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }


        // below code will run one by one 
        // await conversation.save();
        // await newMessage.save();

        //we have to use Promise for parallel saving
        await Promise.all([conversation.save(), newMessage.save()])

        //SOCKET IO FUNCTIONALITY WILL GO HERE 
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log("ddd",receiverSocketId);
        if (receiverSocketId) {
            // io.to(<socket_id>).emit() used to send events to specific client
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }


        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params; //userToChatId means receiverId
        const senderId = req.user._id; // from protectRoute

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("messages") //not a reference but actual messages ,populate gives actual message from message(id)

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessage controller", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}