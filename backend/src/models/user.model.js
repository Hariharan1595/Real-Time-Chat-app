import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
        trim: true,
        maxLength: 25,
        minLength: 3

    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    profilePic:{
        type: String,
        default: ""
    }
},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;