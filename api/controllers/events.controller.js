const Event = require("../models/Events.js");
const fs = require("fs").promises;
const path = require("path");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils.js");




const generateEvent = async (req, res) => {
    const { ename, etype, ptype, noOfParticipants, edate, edetails, rules, rcdate, hasSubEvents, enature } = req.body;
    let brochure, poster;
    try {

        const trimmedFields = {
            ename: ename.trim(),
            etype: etype.trim(),
            edetails: edetails.trim(),
            rules: rules.trim(),
            enature: enature.trim()
        };

        // Check if any required field is empty after trimming
        const requiredFields = ['ename', 'etype', 'edetails','rules', 'enature'];
        for (const field of requiredFields) {
            if (!trimmedFields[field]) {
                return res.status(400).json({ message: `${field} cannot be empty.` });
            }
        }

        // Additional validation for specific fields if needed
        if (!hasSubEvents) {
            if(isNaN(parseInt(noOfParticipants))){
                return res.status(400).json({ message: "Number of participants should be a valid number." });
            }
            if(ptype.trim()===""){
                return res.status(400).json({ message: "Participation Type  is a Required Field." });
            }
        }


        if (req.files["ebrochure"]) {
            brochure = req.files["ebrochure"][0]; // Accessing the first file uploaded for "ebrochure" field
        }
        if (req.files["eposter"]) {
            poster = req.files["eposter"][0]; // Accessing the first file uploaded for "eposter" field
        }


        const originalBrochureName = brochure ? brochure.originalname : "";
        const originalPosterName = poster ? poster.originalname : "";
        const current_time = Date.now();
        let newBrochurePath="",newPosterPath="";
        
        if (brochure) {
            var result = await uploadToCloudinary(brochure.path,"pdf"); 
            newBrochurePath = result.url;
            
        }
        if (poster) {
            var result = await uploadToCloudinary(poster.path,"image"); 
             newPosterPath = result.url;

        }

        const subEvents = JSON.parse(req.body.subEvents || "[]"); // Parse subEvents JSON string, default to empty array if not provided
        const genEvent = await Event.create({
            ename: ename.trim(),
            etype: etype.trim(),
            ptype: ptype.trim(),
            enature: enature.trim(),
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
        if (brochure) {
            await fs.unlink(brochure.path); // Delete brochure file if an error occurs
        }
        if (poster) {
            await fs.unlink(poster.path); // Delete poster file if an error occurs
        }
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

const updateEventDetails = async (req, res) => {
    const id = req.params.id;
    const current_time = Date.now();
    const data = await Event.findById(id);

    try {
        const { ename, etype, ptype, noOfParticipants, edate, edetails, rules, rcdate, hasSubEvents, enature } = req.body;

        const trimmedFields = {
            ename: ename.trim(),
            etype: etype.trim(),
            edetails: edetails.trim(),
            rules: rules.trim(),
            enature: enature.trim()
        };

        // Check if any required field is empty after trimming
        const requiredFields = ['ename', 'etype', 'edetails','rules', 'enature'];
        for (const field of requiredFields) {
            if (!trimmedFields[field]) {
                return res.status(400).json({ message: `${field} cannot be empty.` });
            }
        }

        // Additional validation for specific fields if needed
        if (!hasSubEvents) {
            if(isNaN(parseInt(noOfParticipants))){
                return res.status(400).json({ message: "Number of participants should be a valid number." });
            }
            if(ptype.trim()===""){
                return res.status(400).json({ message: "Participation Type  is a Required Field." });
            }
        }



        let originalBrochureName, originalPosterName, newBrochurePath, newPosterPath;

        // Upload new brochure file to Cloudinary
        if (req.files["ebrochure"]) {
            const brochure = req.files["ebrochure"][0];
            const result = await uploadToCloudinary(brochure.path, "pdf");
            originalBrochureName = brochure.originalname;
            newBrochurePath = result.url;

            // Delete previous brochure file from Cloudinary
            if (data?.ebrochurePath) {
                const publicId = data.ebrochurePath.split('/').slice(-1)[0].split('.')[0];
                await deleteFromCloudinary(publicId);
            }
        } else {
            originalBrochureName = data?.ebrochureName;
            newBrochurePath = data?.ebrochurePath;
        }

        // Upload new poster file to Cloudinary
        if (req.files["eposter"]) {
            const poster = req.files["eposter"][0];
            const result = await uploadToCloudinary(poster.path, "image");
            originalPosterName = poster.originalname;
            newPosterPath = result.url;

            // Delete previous poster file from Cloudinary
            if (data?.eposterPath) {
                const publicId = data.eposterPath.split('/').slice(-1)[0].split('.')[0];
                await deleteFromCloudinary(publicId);
            }
        } else {
            originalPosterName = data?.eposterName;
            newPosterPath = data?.eposterPath;
        }

        // Update event details in the database
        const subEvents = JSON.parse(req.body.subEvents);
        const dataToUpdate = { ename, etype, ptype, enature, noOfParticipants, edate, edetails, rules, rcdate, ebrochureName: originalBrochureName, ebrochurePath: newBrochurePath, eposterName: originalPosterName, eposterPath: newPosterPath, hasSubEvents, subEvents };
        await Event.updateOne({ _id: id }, { $set: dataToUpdate });

        return res.status(200).json({ "message": "Event Updated Successfully", "result": true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Failed to update event", "result": false });
    }
}



module.exports = {
    generateEvent,
    getAllEvents,
    getSpecificEvent,
    changeEventStatus,
    updateEventDetails
};

