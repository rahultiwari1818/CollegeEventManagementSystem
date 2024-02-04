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
    const newBrochurePath = `uploads/${ename}_brochure_${current_time}${path.extname(originalBrochureName)}`;
    const newPosterPath = `uploads/${ename}_poster_${current_time}${path.extname(originalPosterName)}`;

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
    const current_time = Date.now();
    const data = await Event.find({_id:id});

    try{


    const { ename, etype, ptype, noOfParticipants, edate, edetails, rules, rcdate, hasSubEvents,enature } = req.body;
    let originalBrochureName,originalPosterName,newBrochurePath,newPosterPath;
    if(req.files["ebrochure"]){
        const brochure = req.files["ebrochure"]; // Accessing the first file uploaded for "ebrochure" field
         originalBrochureName = brochure.originalname;
         newBrochurePath = `uploads/${ename}_brochure_${current_time}${path.extname(originalBrochureName)}`;

        if(data?.ebrochurePath !== ""){
            await fs.unlink(data?.ebrochurePath)
        }

        await fs.rename(brochure.path, newBrochurePath);

    }
    else{
        console.log("called");
         originalBrochureName = data?.ebrochureName;
         newBrochurePath = data?.ebrochurePath;
    }

    if(req.files["eposter"]){
        const poster = req.files["eposter"][0]; // Accessing the first file uploaded for "eposter" field
         originalPosterName = poster.originalname;
         newPosterPath = `uploads/${ename}_poster_${current_time}${path.extname(originalPosterName)}`;

        if(data?.eposterPath !== ""){
            await fs.unlink(data?.eposterPath)
        }
        await fs.rename(poster.path, newPosterPath);
    }
    else{

         originalPosterName = data?.eposterName;
         newPosterPath = data?.eposterPath;
    }




        const subEvents = JSON.parse(req.body.subEvents); // Parse subEvents JSON string

    const dataToUpdate = {
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
    };
    const result = await Event.updateOne({ _id: id },{ $set: dataToUpdate});
    return res.status(200).json({"message":"Event Updated Successfully","result":true})

    } catch (error) {
        console.log(error);

    }

}


module.exports = {
    generateEvent,
    getAllEvents,
    getSpecificEvent,
    changeEventStatus,
    updateEventDetails
};

