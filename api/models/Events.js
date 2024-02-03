const mongoose = require("mongoose");

const {Schema} = mongoose;

const EventsSchema = new Schema({
    ename:{
        required:true,
        type:String
    },
    etype:{
        required:true,
        type:String
    },
    ptype:{
        type:String
    },
    enature:{
        required:true,
        type:String
    },
    noOfParticipants:{
        required:true,
        type:Number
    },
    edate:{
        required:true,
        type:Date
    },
    edetails:{
        required:true,
        type:String
    },
    rules:{
        required:true,
        type:String
    },
    rcdate:{
        required:true,
        type:Date
    },
    ebrochureName:{
        type:String
    },
    ebrochurePath:{
        type:String
    },
    ePosterName:{
        type:String
    },
    ePosterPath:{
        type:String
    },
    hasSubEvents:{
        required:true,
        type:Boolean,
    },
    subEvents:{
        required:true,
        type:Array
    },
    isCanceled:{
        type:Boolean
    }




});

const Events = mongoose.model("Events",EventsSchema);

module.exports = Events;