const Course = require("../models/Course");

const addCourse = async (req, res) => {
    try {
        const { courseName, noOfSemesters } = req.body;
        if (courseName.trim() === "") {
            return res.status(400).json({
                message: "Provide a Valid Course Name.",
                result: false
            })
        }

        const existingCoursesObject = await Course.find();

        const existingCourses = existingCoursesObject.map(course => course.courseName.toLowerCase());

        if (existingCourses.includes(courseName.trim().toLowerCase())) {
            return res.status(400).json({
                message: "Course Name Already Exists.",
                result: false
            })
        }

        const course = await Course.create({
            courseName: courseName.trim(),
            noOfSemesters: noOfSemesters
        });

        return res.status(200).json({
            message: "Course Added Successfully",
            result: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Unable to Add this Course. Some Error Occured",
            result: false
        });
    }
};

const updateCourse = async (req, res) => {

    try {

        const {id,courseName,noOfSemesters} = req.body;
        if (courseName.trim() === "") {
            return res.status(400).json({
                message: "Provide a Valid Course Name.",
                result: false
            })
        }

        const existingCoursesObject = await Course.find({_id:{$ne:id}});

        const existingCourses = existingCoursesObject.map(course => course.courseName.toLowerCase());

        if (existingCourses.includes(courseName.trim().toLowerCase())) {
            return res.status(400).json({
                message: "Course Name Already Exists.",
                result: false
            })
        }

        const updatedCourse = await Course.findOneAndUpdate(
            {_id:id},
            {
                $set :
                {
                    courseName:courseName,
                    noOfSemesters:noOfSemesters
                }
            },
            {new:true}

        );

        return res.status(200).json({
            message:"Course Updated Successfully",
            result:false,
            data:updatedCourse
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Unable to Add this Course. Some Error Occured",
            result: false
        });
    }

}

const deleteCourse = async (req, res) => {

    try {

    } catch (error) {

    }

}

const getAllCourses = async (req, res) => {

    try {

        const data = await Course.find();
        return res.status(200).json({
            message: "Courses Fetched Successfully",
            data: data,
            result: true
        })

    } catch (error) {
        return res.status(500).json({
            message: "Some Error Occured",
            result: false
        })
    }

}


module.exports = {
    addCourse,
     getAllCourses,
     updateCourse
};