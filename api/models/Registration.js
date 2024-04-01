const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const RegistrationSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Events',
        required: true
    },
    sId: {
        type: String
    },
    studentData: [{

        type: Schema.Types.ObjectId,
        ref: 'Students',
        required: true

    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    rank:{
        type:Number,
        required:true
    }

});


const Registration = mongoose.model("Registration", RegistrationSchema);

module.exports = Registration;