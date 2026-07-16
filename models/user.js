const express = require("express");
const { required } = require("joi");
const { mongo, default: mongoose, Types } = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose").default;

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
})

userSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model("user" , userSchema);
