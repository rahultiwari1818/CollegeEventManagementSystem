const { ObjectId } = require("mongodb");
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
        type: Schema.Types.ObjectId,
        ref: 'EventType',
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
    eligibleCourses:[{
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required:true
    }],
    ebrochurePath:{
        type:String
    },
    eposterName:{
        type:String
    },
    eposterPath:{
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
    courseWiseResultDeclaration:{
        required:true,
        type:Boolean
    },
    eligibleSemesters:{
        type:Array,
    },
    updationLog:[{
        change: String,
        by: {
            type: Schema.Types.ObjectId,
            ref: 'Faculties'
        },
        at: Date
    }],
    isCanceled:{
        type:Boolean
    }




});

const Events = mongoose.model("Events",EventsSchema);

module.exports = Events;