const {Schema, default: mongoose} = require("mongoose");

const EventTypeSchema = new Schema({
    eventTypeLogoPath:{
        required:true,
        type:String
    },
    eventTypeLogo:{
        required:true,
        type:String
    },
    eventTypeName:{
        required:true,
        type:String
    },
    committeeMembers: [{
         
            type: Schema.Types.ObjectId,
            ref: 'Faculties'
        
    }]
});

const EventType = mongoose.model("EventType",EventTypeSchema);
module.exports = EventType;