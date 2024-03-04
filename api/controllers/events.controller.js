const Event = require("../models/Events.js");
const fs = require("fs").promises;
const path = require("path");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils.js");
const Registration = require("../models/Registration.js");
const { isValidObjectId } = require("mongoose");
const Students = require("../models/Students.js");
// const messaging = require("../config/firebase.js");



const generateEvent = async (req, res) => {
    const { ename, etype, ptype, noOfParticipants, edate, edetails, rules, rcdate, hasSubEvents, enature, generator } = req.body;
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
        const requiredFields = ['ename', 'etype', 'edetails', 'rules', 'enature'];
        for (const field of requiredFields) {
            if (!trimmedFields[field]) {
                return res.status(400).json({ message: `${field} cannot be empty.` });
            }
        }

        // Additional validation for specific fields if needed
        if (!hasSubEvents) {
            if (isNaN(parseInt(noOfParticipants))) {
                return res.status(400).json({ message: "Number of participants should be a valid number." });
            }
            if (ptype.trim() === "") {
                return res.status(400).json({ message: "Participation Type  is a Required Field." });
            }
        }

        if (!isValidObjectId(generator)) {
            return res.status(401).json({
                message: "Invalid User Trying to generate Event",
                result: false
            })
        }

        if (req.files["ebrochure"]) {
            brochure = req.files["ebrochure"][0]; // Accessing the first file uploaded for "ebrochure" field
        }
        if (req.files["eposter"]) {
            poster = req.files["eposter"][0]; // Accessing the first file uploaded for "eposter" field
        }


        const originalBrochureName = brochure ? brochure.originalname : "";
        const originalPosterName = poster ? poster.originalname : "";
        let newBrochurePath = "", newPosterPath = "";

        if (brochure) {
            var result = await uploadToCloudinary(brochure.path, "pdf");
            newBrochurePath = result.url;

        }
        if (poster) {
            var result = await uploadToCloudinary(poster.path, "image");
            newPosterPath = result.url;

        }

        const subEvents = JSON.parse(req.body.subEvents || "[]"); // Parse subEvents JSON string, default to empty array if not provided
        const eligibleCourses = JSON.parse(req.body.eligibleCourses || "[]"); // Parse subEvents JSON string, default to empty array if not provided
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
            eligibleCourses: eligibleCourses,
            isCanceled: false,
            updationLog: [{ change: "Generated", by: generator, at: Date.now() }]
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



const getAllEvents = async (req, res) => {
    try {
        let query = {};

        // Check if course parameter is provided
        const { course } = req.query;
        if (course && course !== "") {
            // If course is provided, filter events by the course parameter
            query = { eligibleCourses: { $in: [course] } };
        }
        // console.log(query)
        // Fetch events based on the query
        const data = await Event.find(query).sort({ edate: 1 }).populate("enature");
        return res.status(200).json({ "message": "Event Fetched Successfully", "data": data, "result": true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "message": "Some Error Occured", "result": false });
    }
}



const getSpecificEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Event.findById(id)
            .populate('enature')
            .populate({
                path: 'updationLog.by',
                select: '-password' // Exclude the password field
            });

        return res.status(200).json({ "message": "Event Fetched Successfully", "data": data, "result": true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Some Error Occurred", "result": false });
    }
}


const changeEventStatus = async (req, res) => {

    try {
        const id = req.params.id;
        const data = req.body.isCanceled;
        const userId = req.body.userId;
        const text = data ? 'Cancelled' : 'Activated';
        const updateData = {
            isCanceled: data,
            
        };

        const result = await Event.updateOne({ _id: id }, { $set: updateData , $push: {
            updationLog: { change: text, by: userId, at: Date.now() },
            
        }
        });
        const message = (data.isCanceled) ? "Event Cancelled Successfully" : "Event Activated Successfully";
        return res.status(200).json({ "message": message, "result": true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "message": "Some Error Occured", "result": false });
    }
}

const updateEventDetails = async (req, res) => {
    const id = req.params.id;
    const current_time = Date.now();
    const data = await Event.findById(id);

    try {
        const { ename, etype, ptype, noOfParticipants, edate, edetails, rules, rcdate, hasSubEvents, enature, updatedBy } = req.body;

        const trimmedFields = {
            ename: ename.trim(),
            etype: etype.trim(),
            edetails: edetails.trim(),
            rules: rules.trim(),
            enature: enature.trim()
        };

        // Check if any required field is empty after trimming
        const requiredFields = ['ename', 'etype', 'edetails', 'rules', 'enature'];
        for (const field of requiredFields) {
            if (!trimmedFields[field]) {
                return res.status(400).json({ message: `${field} cannot be empty.` });
            }
        }

        // Additional validation for specific fields if needed
        if (!hasSubEvents) {
            if (isNaN(parseInt(noOfParticipants))) {
                return res.status(400).json({ message: "Number of participants should be a valid number." });
            }
            if (ptype.trim() === "") {
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
        const eligibleCourses = JSON.parse(req.body.eligibleCourses); // Parse subEvents JSON string, default to empty array if not provided
        const dataToUpdate = {
            ename, etype, ptype, enature, noOfParticipants, edate, edetails, rules, rcdate, ebrochureName: originalBrochureName, ebrochurePath: newBrochurePath, eposterName: originalPosterName, eposterPath: newPosterPath, hasSubEvents, subEvents, eligibleCourses
        };

        // Use findOneAndUpdate with $push to add to the updationLog array
        const updatedEvent = await Event.findOneAndUpdate({ _id: id }, {
            $set: dataToUpdate,
            $push: { updationLog: { change: "Updated", by: updatedBy, at: Date.now() } }
        }, { new: true });

        return res.status(200).json({ "message": "Event Updated Successfully", "result": true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Some Error Occured", "result": false });
    }
}



const registerInEvent = async (req, res) => {

    try {

        const { eventId, ename, hasSubEvents } = req.body;
        let sId, subEventName;
        if (hasSubEvents) {
            sId = req.body.sId;
            subEventName = req.body.subEventName;
        }

        const studentData = JSON.parse(req.body.studentData)

        for (let student of studentData) {
            if (!isValidObjectId(student)) {
                return res.status(400).json({
                    message: "Please Provide Data of All Participants",
                    result: false
                })
            }
        }


        // Check if any sid in studentData is already registered in the same event and subevent
        for (let student of studentData) {
            const existingRegistration = await Registration.findOne({
                eventId: eventId,
                sId: sId,
                studentData: { $in: [student] }
            });
            if (existingRegistration) {
                const studentData = await Students.findOne({ _id: student });

                return res.status(400).json({
                    message: `Student with SID ${studentData.sid} is already registered in the same event ${sId ? 'and subevent.' : '.'} `,
                    result: false
                });
            }
        }



        const registrationDetails = await Registration.create({
            eventId: eventId,
            ename: ename,
            sId: sId,
            subEventName: subEventName,
            studentData: studentData,
            createdAt: Date.now(),
            status: 'pending',
            updatedAt: Date.now()
        })

        // const tokens = await Students.find(
        //    { _id: { $in: studentData }},
        //    { token: 1, _id: 0 } 
        // )

        // const registrationTokens = tokens.map((token)=>token.token);

        // const message = {
        //     data: { score: '850', time: '2:45' },
        //     tokens: registrationTokens,
        // };

        // console.log(registrationTokens)
        // messaging.sendEachForMulticast(message)
        //     .then((response) => {
        //         if (response.failureCount > 0) {
        //             const failedTokens = [];
        //             response.responses.forEach((resp, idx) => {
        //                 if (!resp.success) {
        //                     failedTokens.push(tokens[idx]);
        //                 }
        //             });
        //             console.log('List of tokens that caused failures: ' + failedTokens);
        //         }
        //         console.log(response)
        //     });

        return res.status(200).json({
            result: true,
            message: "Registration Request Sent Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Some Error Occured", "result": false });

    }

}

const getRegistrationDataOfEvent = async (req, res) => {
    try {
        const { eventId, status } = req.query;// Extracting status query parameter

        // Constructing the filter object based on the presence of status
        const filter = { eventId };
        if (status !== undefined && status !== '') {
            filter.status = status;
        }
        // Finding registration details based on the constructed filter
        const registrationDetails = await Registration.find(filter).populate({
            path: "studentData",
            populate: {
                path: "course",
            },
            select: "-password" // Exclude the password field from the populated committeeMembers
        })
        return res.status(200).json({
            message: "Registration Data Fetched Successfully.",
            result: true,
            data: registrationDetails
        });
    } catch (error) {
        return res.status(500).json({
            message: "Some Error Occurred",
            result: false
        });
    }
};


const approveOrRejectRegistrationRequest = async (req, res) => {

    try {

        const { reqId, status } = req.body;

        const updatedRegData = await Registration.updateOne(
            { _id: reqId },
            {
                $set: {
                    status: status,
                    updatedAt: Date.now()
                }
            }
        )

        return res.status(200).json({
            message: `Request Status ${status} Successfully.`,
            result: true
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Some Error Occured", "result": false });
    }

}

const studentParticipatedEvents = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Find registrations where studentData contains an object with the specified studentId
        const registrations = await Registration.find({
            studentData: { $in: [studentId] }
        }).populate({
            path: "studentData",
            populate: {
                path: "course",
            },
            select: "-password" // Exclude the password field from the populated committeeMembers
        });;

        return res.status(200).json({
            message: "Registration documents fetched successfully",
            result: true,
            data: registrations
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Some Error Occurred",
            result: false
        });
    }
};

const resultDeclaration = async (req, res) => {

    try {

    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Some Error Occured", "result": false });
    }

}

module.exports = {
    generateEvent,
    getAllEvents,
    getSpecificEvent,
    changeEventStatus,
    updateEventDetails,
    registerInEvent,
    getRegistrationDataOfEvent,
    approveOrRejectRegistrationRequest,
    studentParticipatedEvents,
    resultDeclaration
};

