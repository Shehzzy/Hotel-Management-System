const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,

    },
    username:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }


});

var userModel = mongoose.model("Users", userSchema);

module.exports = userModel;