const mongoose = require("mongoose");

const {Schema} = mongoose;

const CollegeSchema = new Schema({
    collegename:{
        required:true,
        type:String
    },
    collegelogo:{
        required:true,
        type:String
    }
});

const College = mongoose.model("College",CollegeSchema);

module.exports = College;