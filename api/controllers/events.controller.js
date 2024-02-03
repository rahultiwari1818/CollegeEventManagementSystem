const Event = require("../models/Events.js");
const fs = require("fs").promises;
const path = require("path")
const generateEvent = async (req, res) => {
    const { ename, etype, ptype, noOfParticipants, edate, edetails, rules, rcdate, hasSubEvents,enature } = req.body;
    const brochure = req.files["ebrochure"][0]; // Accessing the first file uploaded for "ebrochure" field
    const poster = req.files["eposter"][0]; // Accessing the first file uploaded for "eposter" field
    const originalBrochureName = brochure.originalname;
    const originalPosterName = poster.originalname;
    const current_time = Date.now();
    const newBrochurePath = `uploads/${ename}_brochure_${current_time}.${path.extname(originalBrochureName)}`;
    const newPosterPath = `uploads/${ename}_poster_${current_time}.${path.extname(originalPosterName)}`;

    try {
        await fs.rename(brochure.path, newBrochurePath);
        await fs.rename(poster.path, newPosterPath);

        const subEvents = JSON.parse(req.body.subEvents); // Parse subEvents JSON string
        const genEvent = await Event.create({
            ename: ename.trim(),
            etype: etype.trim(),
            ptype: ptype.trim(),
            enature:enature.trim(),
            noOfParticipants: noOfParticipants,
            edate: edate,
            edetails: edetails.trim(),
            rules: rules.trim(),
            rcdate: rcdate,
            ebrochureName: originalBrochureName,
            ebrochurePath: newBrochurePath,
            eposterName: originalPosterName,
            eposterPath: newPosterPath,
            hasSubEvents: hasSubEvents,
            subEvents: subEvents,
            isCanceled: false
        });

        return res.status(200).json({ "message": "Event Generated Successfully", "result": true });
    } catch (err) {
        console.error('Error:', err.message);
        return res.status(500).json({ "message": "Failed to generate event", "result": false });
    }
};


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

