const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const College = require("../models/College");
const Course = require("../models/Course");
const Students = require("../models/Students");
const Faculties = require("../models/Faculties");
const Events = require("../models/Events");
const EventType = require("../models/EventType");
const { deleteFromCloudinary, uploadToCloudinary } = require("../utils");
const Registration = require("../models/Registration");

const SECRET_KEY = process.env.SECRET_KEY;

const checkSetUp = async(req,res)=>{
    try {
        const data = await College.find({});
        if(data.length > 0){
            return res.status(200).json({"message":"College Fetched Successfully","isSetUp":true})
        }
        else{
            return res.status(200).json({"message":"Need Set Up First.","isSetUp":false})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Some Error Occured",
            result:false
        })
    }
}

const getCollegeData = async(req,res) =>{

    try {
        
        const collegeData = await College.find();

        return res.status(200).json({
            message:"College Data Fetched Successfully",
            result:true,
            data:collegeData
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Some Error Occured",
            result:false
        })
    }

}


const updateCollegeData = async(req,res)=>{

    try {

        const {newCollegeName,id,oldCollegePDFBannerPath,oldCollegePDFBannerName} = req.body;

        if(!newCollegeName || newCollegeName.trim()===""){
            return res.status(400).json({
                message:"Please Provide Valid College Name",
                result:false
            })
        }

        const collegePDFBanner = req?.file;
        let newCollegePDFBannerName;
        let newCollegePDFBannerPath;

        if(collegePDFBanner){
             newCollegePDFBannerName = collegePDFBanner.originalname;

            const result = await uploadToCloudinary(collegePDFBanner.path, "image");
            if (result.message === "Fail") {
                return res.status(500).json({
                    message: "Some Error Occued...",
                    result: false
                })
            }
            newCollegePDFBannerPath = result.url;
            if (oldCollegePDFBannerPath !== ".") {
                const publicId = oldCollegePDFBannerPath.split('/').slice(-1)[0].split('.')[0];
                await deleteFromCloudinary(publicId);
            }
        }


        if(!collegePDFBanner?.originalname){
            newCollegePDFBannerName=oldCollegePDFBannerName,
            newCollegePDFBannerPath=oldCollegePDFBannerPath;
        }
        
        const updatedCollegeName = await College.findOneAndUpdate(
            {_id:id},
            {
                $set:{
                    collegename:newCollegeName,
                    collegePdfBannerName:newCollegePDFBannerName,
                    collegePdfBannerPath:newCollegePDFBannerPath
                }
            },
            { new: true } // To return the updated document
        )

        return res.status(200).json({
            message:"College Data Updated Successfully",
            result:true,
            data:updatedCollegeName
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Some Error Occured",
            result:false
        })
    }

}


const getWholeCollegeData = async (req,res) =>{

    try {
        
        const collegeData = await College.find();
        const courseData = await Course.countDocuments();
        const studentData = await Students.countDocuments();
        const facultyData = await Faculties.countDocuments();
        const eventsData = await Events.countDocuments();
        const eventTypesData = await EventType.countDocuments();

        return res.status(200).json({
            message:"College Data Fetched Successfully",
            result:true,
            data:[
                collegeData,
                {
                    label : "Courses",
                    data:courseData
                },
                {
                    label : "Students",
                    data:studentData
                },
                {
                    label : "Faculties",
                    data:facultyData
                },
                {
                    label : "Event Types",
                    data:eventTypesData
                },
                {
                    label : "Events",
                    data:eventsData
                }
                
            ]
        })


    } catch (error) {
        return res.status(500).json({
            message:"Some Error Occured",
            result:false
        })
    }

}

const getAnalytics = async (req, res) => {
    try {
        let { eventType, fromDate, toDate } = req.query;

        let query = {};
        // Check if eventType is provided
        if (eventType && eventType !== "") {
            query.enature = eventType;
        }

        // Check if fromDate and toDate are provided
        if (fromDate && toDate) {
            // Convert fromDate and toDate strings to Date objects
            const fromDateObj = new Date(fromDate);
            const toDateObj = new Date(toDate);

            // Add conditions to filter events based on updationLog generation date
            query['edate'] = { $lte: fromDateObj, $gte: toDateObj };
        }

        // Fetch events based on the query
        const eventData = await Events.find(query).populate("enature").populate("eligibleCourses");

        const data = await Promise.all(eventData.map(async (event) => {
            const approvedParticipation = await Registration.find({ eventId: event._id, status: "approved" });
            const results = await Registration.find({ eventId: event._id, status: "approved",rank:{$gt:0} }).populate({
                path: "studentData",
                populate: {
                    path: "course"
                },
                select: "-password"
            });
            results.sort((teamA,teamB)=>teamA.rank-teamB.rank);
            return {
                eventData: event,
                approvedParticipation: approvedParticipation,
                results:results
            };
        }));

        return res.status(200).json({
            message: "Analytics Fetched Successfully!",
            data: data,
            result: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Some Error Occurred",
            result: false
        });
    }
}



module.exports = {
    checkSetUp,
    getCollegeData,
    getWholeCollegeData,
    updateCollegeData,
    getAnalytics
};