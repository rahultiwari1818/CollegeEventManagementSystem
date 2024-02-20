const Course = require("../models/Course");

const addCourse = async (req, res) => {
    try {
        const { courseName } = req.body;
        if(courseName.trim()===""){
            return res.status(400).json({
                message:"Provide a Valid Course Name.",
                result:false
            })
        }
        const course = await Course.create({
            courseName: courseName
        });

        return res.status(200).json({
            message: "Course Added Successfully",
            result: true
        });
    } catch (error) {
        return res.status(400).json({
            message: "Unable to Add this Course. Some Error Occured",
            result: false
        });
    }
};

const updateCourse =  async(req,res)=>{

    try {
        
    } catch (error) {
        
    }
    
}

const deleteCourse = async(req,res) =>{

    try {
        
    } catch (error) {
        
    }
    
}


module.exports = {addCourse};