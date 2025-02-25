import bcrypt from "bcryptjs";
import cloudinary from "../database/cloudinaryDB.js";
import User from "../models/user.model.js";
import generateToken from "../lib/generateToken.js";

// Sign up controller function
export const signUp = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
          profilePic: newUser.profile,
        },
      });
    } else {
      return res.status(500).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Sign in controller function
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword)
      return res.status(400).json({ message: "Invalid credentials" });
    generateToken(user._id, res);
    return res.status(200).json({
      message: "Sign in successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Sign out controller function
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Sign out successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update profile controller function

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: "Profile picture is required" });
    const userId = req.user._id;
    const resUrl = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: resUrl.secure_url },
      { new: true }
    ); //new:true is used to return the updated document
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        updatedUser,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
