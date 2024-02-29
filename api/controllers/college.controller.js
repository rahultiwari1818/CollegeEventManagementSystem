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


const getCollegeData = async (req,res) =>{

    try {
        
        const collegeData = await College.find();
        const courseData = await Course.find();
        const studentData = await Students.find();
        const facultyData = await Faculties.find();
        const eventsData = await Events.find();
        const eventTypesData = await EventType.find();

        return res.status(200).json({
            message:"College Data Fetched Successfully",
            result:true,
            data:[
                collegeData,
                courseData,
                studentData,
                facultyData,
                eventsData,
                eventTypesData
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
    getCollegeData
};