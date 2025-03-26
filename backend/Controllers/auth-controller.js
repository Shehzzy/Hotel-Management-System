const userModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const activeUserStatus = "active";
const inactiveUserStatus = "inactive";


//  AUTHENTICATION API 
//  USER REGISTRATION API - BY DEFAULT INACTIVE
const register = async (req, res) => {
  try {
    const { fullname, username, phone, email, password, role } = req.body;

    const userExists = await userModel.findOne({ email: email });
    if (userExists) { return res.json({ message: "User already exists" }); }

    const newUser = await userModel.create({
      fullname: fullname,
      username: username,
      phone: phone,
      email: email,
      password: password,
      role: role,
      status: inactiveUserStatus
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
    if (newUser) { return res.status(200).json({ message: "User has been created successfully" }); }
  } catch (error) {
    console.log("An error occurred", error.message);
    return res.json({ message: "An error occurred", error });
  }
};

// AUTHENTICATION API
// LOGIN API
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) { return res.json({ message: "Invalid credentials" }); }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) { return res.json({ message: "Invalid credentials" }); }

    if (user.status === inactiveUserStatus) { return res.json({ message: "Your account is inactive" }); }
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

// AUTHENTICATION API
// PROFILE API
const profileData = async (req, res) => {
  try {
    const findUser = await userModel.findOne({ _id: req.user._id, status: activeUserStatus });

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
      status: findUser.status
    };

    return res.json({ message: "Here is your user data", userData });
  } catch (error) {
    console.log("An error occurred in profile API", error.message);
    return res.json({ message: "An error occurred", error });
  }
};


// USER MANAGEMENT API
// Update USER API 
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


// USER MANAGEMENT API
// GET ALL USERS API FOR ADMIN
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find();
    if (!allUsers) { return res.status(404).json({ message: "No users found" }); }
    return res.status(200).json({ message: "Here are all the users", allUsers });

  }
  catch (error) {
    console.error("Server error", error);
    return res.status(404).json({ message: "Server error", error });
  }
}


// USER MANAGEMENT API
// GET SINGLE USER API FOR ADMIN
const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) { return res.status(404).json({ message: "Incorrect user id" }); }
    const singleUser = await userModel.findOne({ _id: userId });
    if (!singleUser) { return res.status(404).json({ message: "User not found" }); }

    return res.status(200).json({ message: "Here is the user data", singleUser });

  } catch (error) {
    console.error("Server error", error);
    return res.json({ message: "Server error", error });
  }
}

// USER MANAGEMENT API
// Update user status API for admin
const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    const findUser = await userModel.findOne({ _id: userId });
    if (!findUser) { return res.status(404).json({ message: "User not found" }); }
    const currentStatus = findUser.status;
    if (currentStatus === status) { return res.status(400).json({ message: `User is already ${currentStatus}` }); }

    if (currentStatus !== status) {
      const updateStatus = await userModel.findByIdAndUpdate(userId, { status: status }, { new: true });
      return res.status(200).json({ message: `User is now ${status}`, updateStatus });
    }

  } catch (error) {
    console.error("Server error", error);
    return res.status(400).json({ message: "Server error", error });
  }
}

// USER MANAGEMENT API
// Delete user API for admin - NOT FOR USE
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const findUser = await userModel.findOne({ _id: userId });
    if(!findUser){ return res.status(404).json({ message: "User not found" }); }
    const deleteUser = await userModel.findByIdAndDelete(userId); 
    return res.status(200).json({ message: "User deleted successfully" });
    
  } catch (error) {
    console.error("Server error", error);
    return res.status(400).json({message:"Server error", error});
  }
}
module.exports = { register, login, profileData, update, getAllUsers, getSingleUser, updateUserStatus , deleteUser};
