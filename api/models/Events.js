const mongoose = require("mongoose");

const {Schema} = mongoose;

const EventsSchema = new Schema({
    // Ename,EType [ Intra-College / Inter-College ],Ptype[ Individual / Group], NoOfParticipants,Edate,Event Details,Rules, RegistrationClosingDate,MaxParticipants/GroupsPerCollege
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
    maxNoOfTeamsPerCollege:{
        required:true,
        type:Number
    },
    efees:{
        type:Number
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