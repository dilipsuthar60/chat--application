import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 char" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email is already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).send({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser?.profilePic,
      });
    } else {
      return res.status(500).json({ message: "Invalid user" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong in sign up" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid cred ....." });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid cred ....." });
    }
    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong in Login" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logout Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong in logout" });
  }
};

export const check = (req, res) => {
  return res.status(200).json(req.user);
};
