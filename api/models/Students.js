const mongoose = require("mongoose");

const {Schema} = mongoose;

const StudentSchema = new Schema({
    name:{
        required:true,
        type:String
    },
    phno:{
        required:true,
        type:String,
        unique:true,
    },
    course:{
        required:true,
        type:String
    },
    address:{
        type:String
    },
    password:{
        required:true,
        type:String
    },

});

const Students = mongoose.model("Students",StudentSchema);

module.exports = Students;