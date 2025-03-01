const userModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

// USER REGISTRATION API
const register = async (req, res) => {
  try {
    const { fullname, username, phone, email, password, role } = req.body;

    const userExists = await userModel.findOne({ email: email });
    if (userExists) {
      return res.json({ message: "User already exists" });
    }

    const newUser = await userModel.create({
      fullname: fullname,
      username: username,
      phone: phone,
      email: email,
      password: password,
      role: role,
    });

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    if (newUser) {
      return res.json({ message: "User has been created successfully", token });
    }
  } catch (error) {
    console.log("An error occurred", error.message);
    return res.json({ message: "An error occurred", error });
  }
};

// LOGIN API
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: "User logged in successfully", token });
  } catch (error) {
    console.log("An error occurred in login API", error.message);
    return res.json({ message: "An error occurred", error });
  }
};

// PROFILE API

const profileData = async (req, res) => {
  try {
    const findUser = await userModel.findOne({ _id: req.user.userId });

    if (!findUser) {
      return res.json({ message: "Unable to find User" });
    }

    var userData = {
      fullname: findUser.fullName,
      email: findUser.email,
      username: findUser.username,
      phone: findUser.phone,
      role: findUser.role,
      password: findUser.password,
    };

    return res.json({ message: "Here is your user data", userData });
  } catch (error) {
    console.log("An error occurred in profile API", error.message);
    return res.json({ message: "An error occurred", error });
  }
};

// Update API
const update = async (req, res) => {
  try {
    const updateUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updateUser) {
      return res.json({ message: "An error occurred while updating data." });
    }

    return res.json({ message: "Records updated successfully", updateUser });
  } catch (error) {
    console.log("An error occurred in update API", error.message);
    return res.json({ message: "An error occurred", error });
  }
};
module.exports = { register, login, profileData, update };
