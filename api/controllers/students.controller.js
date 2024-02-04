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


module.exports = { registerStudentsInBulk };