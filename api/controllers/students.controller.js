const Student = require("../models/Students.js");
const fs = require("fs").promises;
const path = require("path");
const csvtojson = require("csvtojson");
const { vonage } = require("../config/vonage.js");
const { generateOTP } = require("../utils.js");
const { client } = require("../config/redisConfig.js");




const registerStudentsInBulk = async (req, res) => {
    let newStudentCSVFilePath = "";
    try {
        const studentCSVFile = req.file;
        newStudentCSVFilePath = `uploads/${studentCSVFile.originalname}${path.extname(studentCSVFile.originalname)}`
        await fs.rename(studentCSVFile.path, newStudentCSVFilePath)

        const source = await csvtojson().fromFile(`./uploads/${studentCSVFile.originalname}${path.extname(studentCSVFile.originalname)}`); // await the csvtojson promise

        const arrayToInsert = source.map(entry => {
            let dob;
            if (entry["Date Of Birth"]) {
                const dobParts = entry["Date Of Birth"].split("/");
                // Reorder date parts to "mm/dd/yyyy" format
                dob = new Date(`${dobParts[1]}/${dobParts[0]}/${dobParts[2]}`);
            } else {
                // Default date when Date Of Birth is empty or null
                dob = new Date("1/1/2001");
            }

            return {
                course: entry["Course"],
                semester: entry["Semester"],
                division: entry["Division"],
                rollno: entry["Roll Number"],
                sid: entry["SID No"],
                studentName: entry["Student Name"],
                phno: entry["Student Mobile No"],
                gender: entry["Gender"],
                dob: dob,
                password: dob // Assuming password is also "Date Of Birth"
            };
        });
        const result = await Student.insertMany(arrayToInsert);
        res.status(200).json({ success: true, message: "Students registered successfully." });
    } catch (error) {
        // console.error("Error registering students:", error);
        res.status(500).json({ success: false, message: "An error occurred while registering students. Please Check Your CSV File format", error: error });
    }
    finally {
        fs.unlink(newStudentCSVFilePath);
    }
};

const getStudents = async (req, res) => {
    try {
        const searchQuery = req.query.search || "";
        const courseFilter = req.query.course || "";
        const semesterFilter = req.query.semester || "";
        const divisionFilter = req.query.division || "";
        const page = parseInt(req.query.page) || 1; // Current page, default is 1
        const limit = parseInt(req.query.limit) || 10; // Number of items per page, default is 10

        // Define the search criteria
        const searchCriteria = {
            $and: [
                searchQuery ? {
                    $or: [
                        { course: { $regex: searchQuery, $options: 'i' } },
                        { semester: { $regex: searchQuery, $options: 'i' } },
                        { division: { $regex: searchQuery, $options: 'i' } },
                        { rollno: { $regex: searchQuery, $options: 'i' } },
                        { sid: { $regex: searchQuery, $options: 'i' } },
                        { studentName: { $regex: searchQuery, $options: 'i' } },
                        { phno: { $regex: searchQuery, $options: 'i' } },
                        { gender: { $regex: searchQuery, $options: 'i' } }
                    ]
                } : {},
                courseFilter ? { course: courseFilter } : {},
                semesterFilter ? { semester: semesterFilter } : {},
                divisionFilter ? { division: divisionFilter } : {}
            ]
        };

        // Count total number of documents matching the search criteria
        const totalDocuments = await Student.countDocuments(searchCriteria);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalDocuments / limit);

        // Ensure the current page is within valid range
        const currentPage = Math.min(Math.max(page, 1), totalPages);

        // Calculate the number of documents to skip
        const skip = (currentPage - 1) * limit;

        // Find students based on search criteria with pagination
        const data = await Student.find(searchCriteria).skip(skip).limit(limit);

        return res.status(200).json({
            message: "Students Data Fetched Successfully.",
            data: data,
            result: true,
            currentPage: currentPage,
            totalPages: totalPages,
            totalItems: totalDocuments
        });
    } catch (error) {
        return res.status(400).json({ message: "Some Error Occurred.", result: false });
    }
};




const getDivisions = async (req, res) => {
    const course = req.query.course || "";
    const semester = req.query.semester || "";
    try {
        // Fetch all students
        const students = await Student.find({ course: course, semester: semester });

        // Extract unique divisions from the fetched students
        const divisions = [...new Set(students.map(student => student.division))];

        return res.status(200).json({
            "message": "Divisions Fetched Successfully.",
            "data": divisions,
            "result": true
        });
    } catch (error) {
        return res.status(400).json({ "message": "Some Error Occurred.", "result": false });
    }
}

const getIndividualStudents = async (req, res) => {
    const sid = req.params.id;
    try {
        // Fetch all students
        const student = await Student.find({ sid: sid });

        // Extract unique divisions from the fetched students]
        if (student) {
            return res.status(200).json({
                "message": "Student Data Fetched Successfully.",
                "data": student,
                "result": true
            });
        }
        else {
            return res.status(200).json({
                "message": "Student Not Found.",
                "data": {},
                "result": false
            });
        }

    } catch (error) {
        return res.status(400).json({ "message": "Some Error Occurred.", "result": false });
    }
}

const studentForgotPassword = async (req, res) => {
    try {
        const sid = req.body.sid;

        // Assuming Student is a Mongoose model
        const studentData = await Student.find({ sid: sid });

        // Check if studentData is empty
        if (!studentData || studentData.length === 0) {
            return res.status(200).json({
                message: "Student not found. Enter Correct Sid",
                result: false
            });
        }
        const phno = studentData[0].phno;

        const otp = generateOTP();

        client.set(sid, otp);


        const from = "Vonage APIs";
        const to = studentData[0].phno;
        const text = `Your OTP is ${otp}.`;

        async function sendSMS() {
            await vonage.sms.send({ to, from, text })
                .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
        }

        sendSMS();

        return res.status(200).json({
            message: `OTP sent to your mobile number ending with ${phno.slice(6, phno.length)}`,
            result: true
        });



    } catch (error) {
        console.error("Error fetching student data:", error);
        return res.status(500).json({
            message: "Internal Server Error.",
            result: false
        });
    }





}

const verifyOTP = async(req,res)=>{
    try {
        const userOTP = req.body.otp;
        const sid = req.body.sid;

        const generatedOTP = await client.get(sid);
        if(generatedOTP === userOTP){
            return res.status(200)
            .json({
                message:"User Authenticated Successfully",
                result:true
            })
        }
        else{
            return res.status(200)
            .json({
                message:"Incorrect OTP Provided",
                result:false
            })
        }

    } catch (error) {
        
    }
}


const loginStudent = async (req, res) => {

}

module.exports = { registerStudentsInBulk, getStudents, getDivisions, getIndividualStudents, studentForgotPassword,verifyOTP };