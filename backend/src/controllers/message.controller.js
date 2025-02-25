import cloudinary from "../database/cloudinaryDB.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


// Get all users except the current user
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({ _id: { $ne: userId } }).select("-password"); //
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
// Get messages between the current user and the user to chat with
export const getMessage = async (req, res) => {
  try {
    const { id: userToChartId } = req.params;
    const myId = req.user._id;
    const message = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChartId },
        { senderId: userToChartId, receiverId: myId },
      ],
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

// Send a message to a user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;

    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image);
      imageUrl = uploadRes.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const reaceiverSocketId = getReceiverSocketId(receiverId);
    if (reaceiverSocketId) {
      io.to(reaceiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
