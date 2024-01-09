const Event = require("../models/Events.js");
const fs = require("fs");


 const generateEvent = async(req,res)=>{
    const file = req.file;
    const orignalName = file.originalname;
    const current_time = Date.now()
    const newFilePath = `uploads/${current_time}-${file.originalname}`;
    try{

        fs.renameSync(file.path,newFilePath);

    }catch(err){
        return res.status(504).json({"message":err.message,"result":false});
    }

    genEvent = await Event.create({
        ename:req.body.ename.trim(),
        etype:req.body.etype.trim(),
        ptype:req.body.ptype.trim(),
        noOfParticipants:req.body.noOfParticipants,
        edate:req.body.edate,
        edetails:req.body.edetails.trim(),
        rules:req.body.rules.trim(),
        rcdate:req.body.rcdate,
        ebrochureName:orignalName,
        ebrochurePath:newFilePath,
        isCanceled:false
    })
    return res.status(200).json({"message":"Event Generated Successfully","result":true})
}


const getAllEvents = async(req,res)=>{
    const data = await Event.find({}).sort({edate:1});
    return res.status(200).json({"message":"Event Fetched Successfully","data":data,"result":true})
}


 const getSpecificEvent = async(req,res)=>{
    const id = req.params.id;
    const data = await Event.find({_id:id})
    return res.status(200).json({"message":"Event Fetched Successfully","data":data,"result":true})
}

const changeEventStatus = async(req,res)=>{
    const id = req.params.id;
    const data = req.body;
    const result = await Event.updateOne({ _id: id },{ $set: data});
    const message = (data.isCanceled) ? "Event Cancelled Successfully" : "Event Activated Successfully";
    return res.status(200).json({"message":message,"result":true})
}

const updateEventDetails = async(req,res)=>{
    const id = req.params.id;
    const data = {
        ename:req.body.ename.trim(),
        etype:req.body.etype.trim(),
        ptype:req.body.ptype.trim(),
        noOfParticipants:req.body.noOfParticipants,
        edate:req.body.edate,
        edetails:req.body.edetails.trim(),
        rules:req.body.rules.trim(),
        rcdate:req.body.rcdate,
        maxNoOfTeamsPerCollege:req.body.maxNoOfTeamsPerCollege || 0,
        efees:req.body.efees,
    };
    const result = await Event.updateOne({ _id: id },{ $set: data});
    return res.status(200).json({"message":"Event Updated Successfully","result":true})
}


module.exports = {
    generateEvent,
    getAllEvents,
    getSpecificEvent,
    changeEventStatus,
    updateEventDetails
};

