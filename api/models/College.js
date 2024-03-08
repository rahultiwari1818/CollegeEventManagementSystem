const mongoose = require("mongoose");

const {Schema} = mongoose;

const CollegeSchema = new Schema({
    collegename:{
        required:true,
        type:String,
        unique:true
    },
    collegePdfBannerName:{
        type:String,
        required:true
    },
    collegePdfBannerPath:{
        type:String,
        required:true
    }
});

const College = mongoose.model("College",CollegeSchema);

module.exports = College;