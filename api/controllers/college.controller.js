const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const College = require("../models/College");
const Course = require("../models/Course");
const Students = require("../models/Students");
const Faculties = require("../models/Faculties");
const Events = require("../models/Events");
const EventType = require("../models/EventType");

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

        const {newCollegeName,id} = req.body;

        if(!newCollegeName || newCollegeName.trim()===""){
            return res.status(400).json({
                message:"Please Provide Valid College Name",
                result:false
            })
        }

        const updatedCollegeName = await College.findOneAndUpdate(
            {_id:id},
            {
                $set:{
                    collegename:newCollegeName
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


module.exports = {
    checkSetUp,
    getCollegeData,
    getWholeCollegeData,
    updateCollegeData
};