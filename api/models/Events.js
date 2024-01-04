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
    isCanceled:{
        type:Boolean
    }




});

const Events = mongoose.model("Events",EventsSchema);

module.exports = Events;