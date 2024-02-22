const mongoose = require("mongoose");

const {Schema} = mongoose;

const StudentSchema = new Schema({
    profilePic:{
        type:String,
        required:true
    },
    course: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required:true
    },
    division: {
        type: String,
        required:true
    },
    rollno: {
        type: String,
        required:true
    },
    sid: {
        type: String,
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
    gender: {
        type: String,
        required:true
    },
    dob: {
        type: Date
    },
    password:{
        type:String
    }
});

const Students = mongoose.model("Students",StudentSchema);

module.exports = Students;