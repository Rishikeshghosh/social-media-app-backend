import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../Models/user.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    console.log(password, location);
    const count = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, count);
    const newUser = await new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      viwedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).json("All feilds are required!");
    }
    let foundUser = await User.findOne(
      { email: email },
      { email: 1, password: 1 }
    );
    if (!foundUser) {
      res.status(400).json({ message: "User doesn't exist !" });
    } else {
      const isMatched = await bcrypt.compare(password, foundUser.password);
      if (!isMatched) {
        res.status(400).json({ message: "Invalid password !" });
      } else {
        const token = await jwt.sign(
          { id: foundUser._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "30d",
          }
        );
        const user = await User.findOne({ email: email }, { password: 0 });
        res.status(200).json({ token, user });
      }
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const getLoggedInUser = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email: email }).select("-password");
    console.log(user);
    if (user) {
      res.status(200).json(user);
    } else {
      console.log(email);
      res.status(401).json("user not found!");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
