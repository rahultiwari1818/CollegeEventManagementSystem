const Student = require("../models/Students.js");
const fs = require("fs").promises;
const path = require("path");
const csvtojson = require("csvtojson");




const registerStudentsInBulk = async (req, res) => {
    try {
        const studentCSVFile = req.file;
        const newStudentCSVFilePath = `uploads/${studentCSVFile.originalname}${path.extname(studentCSVFile.originalname)}`
         await fs.rename(studentCSVFile.path,newStudentCSVFilePath)

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
        res.status(500).json({ success: false, message: "An error occurred while registering students.",error:error });
    }
};

const getStudents = async (req, res) => {
    try {
        const searchQuery = req.query.search || "";
        const courseFilter = req.query.course || "";
        const semesterFilter = req.query.semester || ""; 
        const divisionFilter = req.query.division || ""; // Extract division filter from query parameters

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
                // Add division filter to search criteria
                divisionFilter ? { division: divisionFilter } : {} 
            ]
        };

        // Find students based on search criteria
        const data = await Student.find(searchCriteria);

        return res.status(200).json({
            "message": "Students Data Fetched Successfully.",
            "data": data,
            "result": true
        });
    } catch (error) {
        return res.status(400).json({ "message": "Some Error Occurred.", "result": false });
    }
}



const getDivisions = async(req,res)=>{
    const course = req.query.course || "";
    try {
        // Fetch all students
        const students = await Student.find({course:course});

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

const studentForgotPassword = async(req,res)=>{

}

const loginStudent = async(req,res)=>{

}

module.exports = { registerStudentsInBulk,getStudents,getDivisions };