const userModel = require("../Models/UserModel");
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

    if (newUser) {
      return res.json({ message: "User has been created successfully" });
    }
  } catch (error) {
    console.log("An error occurred", error.message);
    return res.json({ message: "An error occurred", error });
  }
};


module.exports = {register};