const mongoose = require("mongoose");

const {Schema} = mongoose;

const CourseSchema = new Schema({
    courseName:{
        required:true,
        type:String,
        unique:true
    },
    noOfSemesters:{
        type:Number,
        required:true
    }
});

const Course = mongoose.model("Course",CourseSchema);

module.exports = Course;