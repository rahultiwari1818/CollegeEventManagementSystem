const mongoose = require("mongoose");

const {Schema} = mongoose;

const ResultSchema = new Schema({
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

const Result = mongoose.model("Result",ResultSchema);

module.exports = Result;