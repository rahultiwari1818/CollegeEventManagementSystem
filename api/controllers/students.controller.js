const Student = require("../models/Students.js");
const fs = require("fs").promises;
const path = require("path");
const csvtojson = require("csvtojson");
const { vonage } = require("../config/vonage.js");
const { generateOTP, uploadToCloudinary, deleteFromCloudinary } = require("../utils.js");
const { client } = require("../config/redisConfig.js");
const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Course = require("../models/Course.js");
const transporter = require("../config/mailTransporter");
const { isValidObjectId } = require("mongoose");
const SECRET_KEY = process.env.SECRET_KEY;

const nameRegex = /^[a-zA-Z.][a-zA-Z. ]*$/;
const phnoRegex = /^\d{10}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const registerStudentsInBulk = async (req, res) => {
    let newStudentCSVFilePath = "";
    try {
        const studentCSVFile = req.file;
        console.log(studentCSVFile)
        newStudentCSVFilePath = `uploads/${studentCSVFile.originalname}${path.extname(studentCSVFile.originalname)}`
        await fs.rename(studentCSVFile.path, newStudentCSVFilePath)



        const source = await csvtojson().fromFile(`./uploads/${studentCSVFile.originalname}${path.extname(studentCSVFile.originalname)}`); // await the csvtojson promise

        const courses = await Course.find();
        const students = await Student.find({}, 'sid');

        // Extract the 'sid' values from the result
        const sids = students.map(student => student.sid);



        const invalidRecords = [];

        const arrayToInsert = source.map(entry => {
            let dob;
            if (entry["dob"]) {
                const dobParts = entry["dob"].split("/");
                // Reorder date parts to "mm/dd/yyyy" format
                dob = new Date(`${dobParts[1]}/${dobParts[0]}/${dobParts[2]}`);
            } else {
                // Default date when Date Of Birth is empty or null
                dob = new Date("1/1/2001");
            }

            let flag = false;
            let courseId = false;
            for (let course of courses) {
                if (course.courseName.toLowerCase() === entry["course"].trim().toLowerCase() && course.noOfSemesters >= Number(entry["semester"])) {
                    courseId = course._id;
                    flag = true;
                    break;
                }
            }


            if (!["male", "female", "others"].includes(String(entry["gender"]).trim().toLowerCase())) {
                flag = false;
                console.log("gender", entry["gender"])
            }

            if (isNaN(entry["division"])) {
                console.log("division", entry["division"])
                flag = false;
            }

            if (isNaN(entry["roll no"])) {
                console.log("rollno", entry["roll no"])
                flag = false;
            }

            if (isNaN(entry["sid"])) {
                console.log("sid", entry["sid"])

                flag = false;
            }


            if (sids.includes(entry["sid"].trim())) {
                flag = false;
            }

            if (!nameRegex.test(entry["student name"].trim())) {
                flag = false;
            }

            if (!phnoRegex.test(entry["mobile no"])) {
                flag = false;
            }

            if (!emailRegex.test(entry["email"])) {
                flag = false;
            }

            if (!flag) {
                invalidRecords.push(entry);
                return;
            }

            return {
                profilePicName: ".",
                profilePicPath: ".",
                course: courseId,
                semester: Number(entry["semester"]),
                division: Number(entry["division"]),
                rollno: Number(entry["roll no"]),
                sid: Number(entry["sid"]),
                studentName: entry["student name"].trim(),
                phno: entry["mobile no"],
                email: entry["email"],
                gender: entry["gender"]?.toLowerCase(),
                dob: dob,
                password: dob, // Assuming password is also "Date Of Birth"
                status: "Active",
            };
        });

        const csvData = invalidRecords.map(record => Object.values(record).join(' , ')).join('\n');


        // If there are valid records, insert them into the database
        const validRecordsToInsert = arrayToInsert.filter(record => record); // Filter out undefined records
        if (validRecordsToInsert.length > 0) {
            await Student.insertMany(validRecordsToInsert);
        }

        // Send response
        if (invalidRecords.length > 0) {
            // Send the temporary file containing invalid records to the user for download
            res.status(200).json({ result: true, message: "Students registered with some errors. Check the downloaded file for invalid records.", invalidRecords });
        }
        else {
            // If there are no invalid records, send success response
            res.status(200).json({ result: true, message: "Students registered successfully." });
        }
    } catch (error) {
        console.error("Error registering students:", error);
        res.status(500).json({ result: false, message: "An error occurred while registering students. Check Your CSV Headers", error: error });
    }
    finally {
        // Cleanup: Delete the uploaded CSV file
        fs.unlink(newStudentCSVFilePath);
    }
};

const registerStudentIndividually = async (req, res) => {

    try {

        const { course, semester, division, rollno, sid, studentName, phno, gender, dob, password, email } = req.body;
        const profilePic = req?.file;

        const doesSidAlreadyExists = await Student.find({ sid: Number(sid) });

        let message = "";
        let flag = false;

        if(!isValidObjectId(course)){
            return res.status(200).json({
                message:"Invalid Course Id Provided",
                result:false
            })
        }

        if (!["male", "female"].includes(gender?.trim()?.toLowerCase())) {
            flag = true;
            message += "Gender Must be Male or Female.!";
        }

        if (isNaN(division)) {
            flag = true;
            message += "Division Must be a Number!";
        }

        if (isNaN(rollno)) {
            flag = true;
            message += "Roll no Must be a Number!";
        }

        if (isNaN(sid)) {
            flag = true;
            message += "SID Must be a Number";
        }

        if (isNaN(semester)) {
            flag = true;
            message += "Semester Must be a Number!";
        }

        if (flag) {
            return res.status(200).json({
                message: message,
                result: false
            })
        }

        if (doesSidAlreadyExists.length >= 1) {
            return res.status(400).json({
                message: "SID Already Registered.! ",
                result: false
            })
        }


        const doesRollNoInSameDivExists = await Student.findOne({
            course: course,
            semester: semester,
            division: division,
            rollno: rollno,
            status: "Active"
        });

        if (doesRollNoInSameDivExists) {
            return res.status(400).json({
                message: "A student with the same roll number already exists in this division of semester of the same course.",
                result: false
            });
        }


        if (!profilePic) {
            return res.status(400).json({
                message: "Profile Photo  is Required.! ",
                result: false
            })
        }

        if (!nameRegex.test(studentName.trim())) {
            return res.status(400).json({
                message: "Name Should Only have Alphabets and Spaces",
                result: false
            })
        }




        let profilePicPath = "";
        const profilePicName = profilePic ? profilePic.originalname : "";

        if (profilePic) {
            const result = await uploadToCloudinary(profilePic.path, "image");
            profilePicPath = result.url;
        }



        const salt = await bcrypt.genSalt(10);

        const secPass = await bcrypt.hash(password, salt);
        const newStudent = await Student.create({
            profilePicName,
            profilePicPath,
            course,
            semester: Number(semester),
            division: Number(division),
            rollno: Number(rollno),
            sid: Number(sid),
            studentName,
            phno,
            gender: gender?.toLowerCase(),
            dob,
            password: secPass,
            email,
            status: "Active" // Assuming default status is Active
        });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: 'Successfull Registration in CEMS',
            text: `Your Login Credentials are for CEMS are:
                SID : ${sid} and Password : ${password}.
                please change your password after login
            `
        };

        // Send email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                // return res.status(500).json({
                //     message:"Unable to send Email",
                //     result:false
                // })
                console.log("error in sending mail", error)
            } else {
                // return res.status(200).json({
                //     message:"OTP Mailed Successfully",
                //     result:true
                // });
                console.log("Mail Send Successfully.");
            }
        });


        res.status(200).json({ result: true, message: "Student registered successfully." });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            message: "Some Error Occured",
            result: false
        })
    }


}

const getStudents = async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        const courseFilter = req.query.course || '';
        const semesterFilter = parseInt(req.query.semester) || '';
        const divisionFilter = parseInt(req.query.division) || '';
        const page = parseInt(req.query.page) || 1; // Current page, default is 1
        const limit = parseInt(req.query.limit) || 10; // Number of items per page, default is 10
        const sidFilter = parseInt(req.query.sid) || ''; // Convert to number
        const rollnoFilter = parseInt(req.query.rollno) || ''; // Convert to number

        // Define the search criteria
        const searchCriteria = {
            $and: [
                searchQuery ? {
                    $or: [

                        { studentName: { $regex: searchQuery, $options: 'i' } },
                        { phno: { $regex: searchQuery, $options: 'i' } },
                        { gender: { $regex: searchQuery, $options: 'i' } },
                        { sid: isNaN(searchQuery) ? "" : Number(searchQuery) }
                    ]
                } : {},
                { status: "Active" }, // Filter for active status
                { semester: { $gt: 0 } }, // Filter for semester > 0        
                courseFilter ? { course: courseFilter } : {},
                semesterFilter ? { semester: semesterFilter } : {}, // Direct comparison for numeric fields
                divisionFilter ? { division: divisionFilter } : {}, // Direct comparison for numeric fields
                sidFilter ? { sid: sidFilter } : {}, // Direct comparison for numeric fields
                rollnoFilter ? { rollno: rollnoFilter } : {} // Direct comparison for numeric fields
            ]
        };

        // Count total number of documents matching the search criteria
        const totalDocuments = await Student.countDocuments(searchCriteria);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalDocuments / limit);

        // Ensure the current page is within valid range
        const currentPage = Math.min(Math.max(page, 1), totalPages);

        // Calculate the number of documents to skip
        const skip = ((currentPage - 1) * limit) >= 0 ? ((currentPage - 1) * limit) : 0;

        // Find students based on search criteria with pagination, excluding the password field
        const data = await Student.find(searchCriteria)
            .select('-password') // Exclude the password field
            .populate({
                path: 'course',
                select: 'courseName'
            }) // Populate the 'course' field and include only 'courseName'
            .skip(skip)
            .limit(limit)
            ;

        return res.status(200).json({
            message: 'Students Data Fetched Successfully.',
            data: data,
            result: true,
            currentPage: currentPage,
            totalPages: totalPages,
            totalItems: totalDocuments
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Some Error Occurred.', result: false });
    }
};



const getDivisions = async (req, res) => {

    try {
        const course = req.query.course || "";
        const semester = req.query.semester || "";
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
        return res.status(500).json({ "message": "Some Error Occurred.", "result": false });
    }
}

const getIndividualStudentsFromSid = async (req, res) => {
    const sid = req.params.id;
    try {
        // Fetch student with the provided SID and populate the 'course' field to get the course details
        const student = await Student.findOne({ sid: sid }).populate('course');

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
        return res.status(500).json({ "message": "Some Error Occurred.", "result": false });
    }
}



const getIndividualStudentsFromId = async (req, res) => {
    try {
        // Fetch all students
        const id = req.params.id;

        const student = await Student.findOne({ _id: id }).populate("course");

        // Extract unique divisions from the fetched students]
        if (student) {
            return res.status(200).json({
                "message": "Student Data Fetched Successfully.",
                "data": {
                    course: student.course.courseName,
                    division: student.division,
                    dob: student.dob,
                    gender: student.gender,
                    phno: student.phno,
                    rollno: student.rollno,
                    semester: student.semester,
                    sid: student.sid,
                    name: student.studentName,
                    email: student.email,
                    _id: student._id,
                    profilePicName: student.profilePicName,
                    profilePicPath: student.profilePicPath
                },
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
        console.log(error)
        return res.status(500).json({ "message": "Some Error Occurred.", "result": false });
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
        const to = "91" + studentData[0].phno;
        const text = `Your OTP for CEMS is ${otp}. Don't Share it with anyone.`;

        async function sendSMS() {
            await vonage.sms.send({ to, from, text })
                .then(resp => {
                    console.log('Message sent successfully');
                    console.log(resp);
                    return true;
                })
                .catch(err => {
                    console.log('There was an error sending the messages.');
                    console.error(err);
                    return false;
                });
        }


        if (sendSMS()) {
            return res.status(200).json({
                message: `OTP sent to your mobile number ending with ${phno.slice(6, phno.length)}`,
                result: true
            });
        }
        else {
            return res.status(500).json({
                message: `Unable to send OTP`,
                result: false
            });
        }




    } catch (error) {
        console.error("Error fetching student data:", error);
        return res.status(500).json({
            message: "Some Error Occured.",
            result: false
        });
    }





}

const verifyOTP = async (req, res) => {
    try {
        const userOTP = req.body.otp;
        const sid = req.body.sid;

        const generatedOTP = await client.get(sid);
        if (generatedOTP === userOTP) {

            const studentData = await Student.findOne({ sid });

            const data = {
                user: {
                    _id: studentData._id
                }
            };
            const token = jwtToken.sign(data, SECRET_KEY);

            await client.del(sid);

            return res.status(200)
                .json({
                    message: "User Authenticated Successfully",
                    token: token,
                    result: true
                })
        }
        else {
            return res.status(200)
                .json({
                    message: "Incorrect OTP Provided",
                    result: false
                })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Some Error Occured.",
            result: false
        });
    }
}

const resetPassword = async (req, res) => {
    try {

        const userId = req.user._id;
        // console.log(req.user)
        const newPassword = req.body.newPassword;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password for the user with the specified userId
        await Student.updateOne({ _id: userId }, { password: hashedPassword });

        return res.status(200).json({
            message: "Password Reset Successfully",
            result: true
        })

    } catch (error) {
        console.log(error)
        console.error("Error fetching student data:", error);
        return res.status(500).json({
            message: "Some Error Occured.",
            result: false
        });
    }
}

const loginStudent = async (req, res) => {
    const { sid, password } = req.body;
    try {

        const user = await Student.findOne({ sid: sid })

        if (!user) {
            return res.status(400).json({ "message": "Incorrect SID.!", result: false });
        }

        const comparedPassword = await bcrypt.compare(password, user.password);
        if (!comparedPassword) {
            return res.status(400).json({ "message": "Invalid Password", result: false });
        }

        if (user.status !== "Active") {
            return res.status(400).json({ "message": "Login Locked.. Contact Admin", result: false });

        }

        const data = {
            user: {
                id: user._id,
                role: "Student",
                name: user.studentName,
                course: user.course,
            }
        };
        console.log(data)
        const token = jwtToken.sign(data, SECRET_KEY);

        return res.status(200).json({ "message": "Logged in Successfully", data: user, result: true, token });

    } catch (error) {

        return res.status(500).json({ "message": "Error Occured", result: false });
    }
}

const updateStudentData = async (req, res) => {

    try {


        const { _id, course, semester, division, rollno, sid, studentName, phno, gender, dob, email } = req.body;

        const doesSidAlreadyExists = await Student.findOne({ sid: sid, _id: { $ne: _id } })

        if (doesSidAlreadyExists) {
            return res.status(400).json({
                message: "This SID is Already registered.",
                result: false
            })
        }


        const doesRollNoInSameDivExists = await Student.findOne({
            course: course,
            semester: semester,
            division: division,
            rollno: rollno,
            _id: { $ne: _id }
        });

        if (doesRollNoInSameDivExists) {
            return res.status(400).json({
                message: "A student with the same roll number already exists in this division, semester, and course.",
                result: false
            });
        }


        const updatedStudent = await Student.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    course: course,
                    semester: semester,
                    division: division,
                    rollno: rollno,
                    sid: sid,
                    studentName: studentName,
                    phno: phno,
                    gender: gender,
                    dob: dob,
                    email: email
                }
            },
            { new: true } // To return the updated document
        ).populate('course');

        // Return success response with updated student data
        return res.status(200).json({
            message: "Student data updated successfully.",
            result: true,
            updatedStudent: updatedStudent
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating student data.",
            result: false
        });
    }

}

const changeUserProfilePic = async (req, res) => {

    try {

        const profilePic = req.file;
        if (!profilePic) {
            return res.status(400).json({
                message: "Please Provide Profile Photo",
                result: false
            })
        }
        const userData = await Student.findOne({ _id: req.user.id })



        const profilePicName = profilePic.originalname;
        const result = await uploadToCloudinary(profilePic.path, "image");
        if (result.message === "Fail") {
            return res.status(500).json({
                message: "Some Error Occued...",
                result: false
            })
        }
        const newProfilePicPath = result.url;

        if (userData.profilePicName !== ".") {
            const publicId = userData.profilePicPath.split('/').slice(-1)[0].split('.')[0];
            await deleteFromCloudinary(publicId);
        }


        const updatedData = await Student.findOneAndUpdate(
            { _id: req.user.id },
            {
                $set: {
                    profilePicName: profilePicName,
                    profilePicPath: newProfilePicPath
                }
            },
            { new: true }
        )


        return res.status(200).json({
            message: "Profile Photo Uploaded Sucessfully",
            result: true,
            data: {
                profilePicPath: newProfilePicPath,
                profilePicName
            }
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Some Error Occured",
            result: true
        })
    }

}

const changePassword = async (req, res) => {
    try {

        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await Student.findOne({ _id: userId });

        if (!user) {
            return res.status(400).json({
                message: "Invalid User",
                result: false
            })
        }

        const comparedPassword = await bcrypt.compare(currentPassword, user.password);
        if (!comparedPassword) {
            return res.status(400).json({ "message": "Invalid Password", result: false });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(newPassword, salt);

        const userData = await Student.updateOne(
            { _id: userId },
            {
                $set: {
                    password: secPass
                }
            }
        )

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: user.email,
            subject: 'Password Changed in CEMS',
            text: `Your Password has been changed in CEMS.`
        };

        // Send email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                // return res.status(500).json({
                //     message:"Unable to send Email",
                //     result:false
                // })
                console.log("error in sending mail", error)
            } else {
                // return res.status(200).json({
                //     message:"OTP Mailed Successfully",
                //     result:true
                // });
                console.log("Mail Send Successfully.");
            }
        });

        return res.status(200).json({ "message": "Password Updated  Successfully!", "result": true });


    } catch (error) {
        return res.status(500).json({ "message": "Some Error Occured!", "result": false });

    }
}

const changeStudentStatus = async (req, res) => {

    try {
        const { id, newStatus } = req.body;

        if (!id || !newStatus) {
            return res.status(400).json({
                message: "Id and New Status is Required",
                result: false
            })
        }


        const newData = await Student.findOneAndUpdate(
            { _id: id },
            {
                $set:
                {
                    status: newStatus
                }
            },
            { new: true } // To return the updated document

        )

        return res.status(200).json({
            message: "Student Status Changed Successfully",
            result: true,
            updatedFacultyData: newData
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "message": "Some Error Occured!", "result": false });

    }

}

const promoteStudentsToNextSemester = async (req, res) => {
    try {
        const { courseName } = req.body;

        // Find the course
        const course = await Course.findOne({ courseName });

        // Update student data based on the course's number of semesters
        const result = await Student.updateMany(
            { course: courseName },
            [
                {
                    $set: {
                        semester: {
                            $cond: [
                                { $eq: ["$semester", course.noOfSemesters] },
                                0,
                                {
                                    $cond: [
                                        { $eq: ["$semester", 0] },
                                        0,
                                        { $add: ["$semester", 1] }
                                    ]
                                }
                            ]
                        },
                        status: {
                            $cond: [
                                { $eq: ["$semester", course.noOfSemesters] },
                                "Inactive",
                                "$status"
                            ]
                        }
                    }
                }
            ]
        );


        // Now you can send a response back to the client
        res.status(200).json({ message: "Student Promoted  successfully", result: true, data: result, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Some Error Occurred", result: false });
    }
};

const getStudentCountCourseWise = async (req, res) => {
    try {
        // Aggregate pipeline to count students by course and gender
        const pipeline = [
            // Match documents where semester > 0 and status is Active
            {
                $match: {
                    semester: { $gt: 0 },
                    status: "Active"
                }
            },
            // Group by course and gender and count documents
            {
                $group: {
                    _id: {
                        course: "$course",
                        gender: "$gender"
                    },
                    count: { $sum: 1 }
                }
            },
            // Group by course to sum counts for each gender
            {
                $group: {
                    _id: "$_id.course",
                    totalStudents: { $sum: "$count" },
                    maleStudents: {
                        $sum: {
                            $cond: { if: { $eq: ["$_id.gender", "male"] }, then: "$count", else: 0 }
                        }
                    },
                    femaleStudents: {
                        $sum: {
                            $cond: { if: { $eq: ["$_id.gender", "female"] }, then: "$count", else: 0 }
                        }
                    },
                    otherStudents: {
                        $sum: {
                            $cond: [
                                { $in: ["$_id.gender", ["male", "female"]] },  // Check if gender is not Male or Female
                                0,  // If Male or Female, don't include in "otherStudents" count
                                "$count"  // Otherwise, include in "otherStudents" count
                            ]
                        }
                    }
                }
            },
            // Project to reshape the output
            {
                $project: {
                    _id: 0,
                    course: "$_id",
                    totalStudents: 1,
                    maleStudents: 1,
                    femaleStudents: 1,
                    otherStudents: 1
                }
            },
            // Lookup to join with the Course collection and fetch course name
            {
                $lookup: {
                    from: "courses", // Assuming the name of the Course collection is "courses"
                    localField: "course",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            // Unwind the courseDetails array
            {
                $unwind: "$courseDetails"
            },
            // Project to include only necessary fields
            {
                $project: {
                    course: 1,
                    totalStudents: 1,
                    maleStudents: 1,
                    femaleStudents: 1,
                    otherStudents: 1,
                    courseName: "$courseDetails.courseName" // Assuming the field name in Course collection is "courseName"
                }
            }
        ];

        // Execute the aggregation pipeline
        const result = await Student.aggregate(pipeline);

        // Return the result
        return res.status(200).json({ message: "Student counts by course and gender", data: result, result: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Some Error Occurred", result: false });
    }
};



module.exports = {
    registerStudentsInBulk,
    getStudents,
    getDivisions,
    getIndividualStudentsFromSid,
    studentForgotPassword,
    verifyOTP,
    resetPassword,
    loginStudent,
    getIndividualStudentsFromId,
    registerStudentIndividually,
    updateStudentData,
    changeUserProfilePic,
    changePassword,
    changeStudentStatus,
    promoteStudentsToNextSemester,
    getStudentCountCourseWise
};