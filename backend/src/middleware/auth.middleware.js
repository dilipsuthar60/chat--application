import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req?.cookies?.jwt;
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized...." });
    }
    const decodeToken = jwt.verify(token, "mykey");
    if (!decodeToken) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const userInfo = await User.findById(decodeToken.userId).select(
      "-password"
    );
    req.user = userInfo;
    next();
  } catch (error) {
    console.log(error);
    return res.send({ message: "SomeThing went wrong...." });
  }
};
