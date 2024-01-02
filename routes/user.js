import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router(); // set this as a router
import { UserModel } from "../models/Users.js";

// Register
router.post("/register", async (req, res) => { // asynchronous callback function
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username }); // Confirm whether the username exists
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10); // hash the password
  const newUser = new UserModel({ username, password: hashedPassword }); // add the user to the database{ username: username, password: hashedPassword }
  await newUser.save();
  res.json({ message: "User registered successfully" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) { // the user doesn't exist
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password); // Check the password
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }

  const token = jwt.sign({ id: user._id }, "secret"); // Create a web token for the user to make any requests
  res.json({ token, userID: user._id });
});

export { router as userRouter }; // export these whole things as a router

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, "secret", (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
