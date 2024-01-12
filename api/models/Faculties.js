const mongoose = require("mongoose");

const {Schema} = mongoose;

const FacultySchema = new Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true,
    },
    phno:{
        required:true,
        type:String,
        unique:true,
    },
    role:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },

});

const Faculties = mongoose.model("Faculties",FacultySchema);

module.exports = Faculties;