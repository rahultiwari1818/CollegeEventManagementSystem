const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const {Schema} = mongoose;

const FacultySchema = new Schema({
    profilePicName:{
        type:String,
        required:true
    },
    profilePicPath:{
        type:String,
        required:true
    },
    salutation:{
        required: true,
        type:String,
    },
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
    course:{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    password:{
        required:true,
        type:String
    },
    status:{
        type:String,
        enum: ['Active', 'Inactive'],
        default:"Active",
        required:true
    }

});

const Faculties = mongoose.model("Faculties",FacultySchema);

module.exports = Faculties;