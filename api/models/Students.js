const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const {Schema} = mongoose;

const StudentSchema = new Schema({
    profilePicName:{
        type:String,
        required:true
    },
    profilePicPath:{
        type:String,
        required:true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    semester: {
        type: Number,
        required:true
    },
    division: {
        type: Number,
        required:true
    },
    rollno: {
        type: Number,
        required:true
    },
    sid: {
        type: Number,
        required:true,
        unique:true
    },
    studentName: {
        type: String,
        required:true
    },
    phno: {
        type: String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    gender: {
        type:String,
        enum: ['male', 'female','others'],
        default:"male",
        required:true
    },
    dob: {
        type: Date,
        required:true,
        default: new Date("2001-01-01")
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum: ['Active', 'Inactive'],
        default:"Active",
        required:true
    },
    token:{
        type:String
    }

});

const Students = mongoose.model("Students",StudentSchema);

module.exports = Students;