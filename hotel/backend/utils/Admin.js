const mongoose = require("mongoose");
const userModel = require("../Models/UserModel");

const createDefaultAdmin = async () => {
  try {
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASS;

const existingAdmin = await userModel.findOne({email:adminEmail});

if(!existingAdmin){
const admin = new userModel({
    fullname:"Super Admin",
    username:"superadmin",
    email:adminEmail,
    password:adminPassword,
    role:"admin"
});

await admin.save();
console.log("Default admin created.")
}
else{
    console.log("Admin already exists");
}
  } catch (error) {
    console.log("error creating default admin", error)
  }
};

module.exports = createDefaultAdmin;
