const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const {Schema} = mongoose;

const ResultSchema = new Schema({
    eventId:{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    sId:{
        type:Number
    },
    result:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Registration',
            required: true
    
        }
    ]
});

const Result = mongoose.model("Result",ResultSchema);

module.exports = Result;