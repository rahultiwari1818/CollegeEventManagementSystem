const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Faculties = require("../models/Faculties");
const College = require("../models/College");
const fs = require("fs");

const path = require("path");
const csvtojson = require("csvtojson");
const transporter = require("../config/mailTransporter");
const { generateOTP, uploadToCloudinary, deleteFromCloudinary } = require("../utils");
const { client } = require("../config/redisConfig");
const { isValidObjectId } = require("mongoose");
const Course = require("../models/Course");

const SECRET_KEY = process.env.SECRET_KEY;
const nameRegex = /^[a-zA-Z.][a-zA-Z. ]*$/;
const phnoRegex = /^\d{10}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const registerIndividualFaculties = async (req, res) => {
    try {

        const { name, email, phno, course, password, salutation } = req.body;

        let user = await Faculties.findOne({ email: email });
        let phnoUser = await Faculties.findOne({ phno: phno });


        if (!isValidObjectId(course)) {
            return res.status(200).json({
                message: "Invalid Course Id Provided",
                result: false
            })
        }

        if (user) {
            return res.status(400).json({ "message": "Email Already registered.!", "result": false });
        }

        if (phnoUser) {
            return res.status(400).json({ "message": "Phone Number Already registered.!", "result": false });
        }
        const profilePic = req.file;



        if (!profilePic) {
            return res.status(400).json({
                message: "Profile Photo  is Required.! ",
                result: false
            })
        }
        let profilePicPath = "";
        const profilePicName = profilePic ? profilePic.originalname : "";

        if (profilePic) {
            // const result = await uploadToCloudinary(profilePic.path, "image");
            // profilePicPath = result.url;
            profilePicPath = `uploads/${current_time}-${profilePicName}`;
             try{
         
                 fs.renameSync(profilePic.path,profilePicPath);
         
             }catch(err){
                console.log(err)
                return res.status(500).json({
                    message: "Some Error Occued...",
                    result: false
                })
             }
             
        }




        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);


        user = await Faculties.create({
            salutation: salutation.trim(),
            name: name.trim(),
            password: secPass,
            email: email.trim(),
            role: "Faculty",
            phno: phno.trim(),
            course: course.trim(),
            profilePicName: profilePicName,
            profilePicPath: profilePicPath,
            status: "Active"

        });


        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: 'Successful Registration in CEMS',
            html: `
                <html>
                    <head>
                        <style>
                            /* Define styles for your email */
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ccc;
                                border-radius: 10px;
                                background-color: #f9f9f9;
                            }
                            .header {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                text-align: center;
                                font-size: 24px;
                                font-weight: bold;
                            }
                            p {
                                margin-bottom: 15px;
                                font-size: 18px;
                            }
                            .credentials {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                font-size: 18px;
                                margin-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <p>
                                Your Login Credentials for CEMS are:
                            </p>
                            <div class="credentials">
                                <p>Email : ${email}</p>
                                <p>Password : ${password}</p>
                                <p>Please change your password after login.</p>
                            </div>
                            <p>From CEMS.</p>
                        </div>
                    </body>
                </html>
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

        return res.status(200).json({ "message": "Faculty Registered Successfully!", "result": true });



    } catch (error) {
        console.log(error)
        return res.status(500).json({ "message": "Error Occured", result: false });
    }
}


const registerFacultiesInBulk = async (req, res) => {
    let newfacultyCSVFilePath = "";
    try {
        const facultyCSVFile = req.file;
        newfacultyCSVFilePath = `uploads/${facultyCSVFile.originalname}${path.extname(facultyCSVFile.originalname)}`
        await fs.rename(facultyCSVFile.path, newfacultyCSVFilePath)
        const source = await csvtojson().fromFile(`./uploads/${facultyCSVFile.originalname}${path.extname(facultyCSVFile.originalname)}`); // await the csvtojson promise

        const courses = await Course.find();
        const faculties = await Faculties.find({});

        // Extract the 'sid' values from the result
        const emails = faculties.map(faculty => faculty.email);
        const mobileNos = faculties.map(faculty => faculty.phno);

        const invalidRecords = [];

        const arrayToInsert = source.map(entry => {

            let flag = false;
            let courseId = "";
            for (let course of courses) {
                if (course.courseName.toLowerCase() === entry["course"].trim().toLowerCase()) {
                    courseId = course._id;
                    flag = true;
                    break;
                }
            }


            if (emails.includes(entry["email"])) {
                flag = false;
            }

            if (!nameRegex.test(entry["name"].trim())) {
                flag = false;
            }

            if (!phnoRegex.test(entry["mobile"])) {
                flag = false;
            }


            if (!emailRegex.test(entry["email"])) {
                flag = false;
            }


            if (mobileNos.includes(entry["mobile"])) {
                flag = false;
            }

            if (!flag) {
                invalidRecords.push(entry);
                return;
            }


            return {
                profilePicName: ".",
                profilePicPath: ".",
                salutation: entry["saultation"],
                name: entry["name"],
                email: entry["email"],
                phno: entry["mobile"],
                role: "Faculty",
                course: courseId,
                password: entry["email"],
                status: "Active"
            }
        });

        const csvData = invalidRecords.map(record => Object.values(record).join(' , ')).join('\n');


        // If there are valid records, insert them into the database
        const validRecordsToInsert = arrayToInsert.filter(record => record); // Filter out undefined records
        if (validRecordsToInsert.length > 0) {
            await Faculties.insertMany(validRecordsToInsert);
        }

        // Send response
        if (invalidRecords.length > 0) {
            // Send the temporary file containing invalid records to the user for download
            res.status(200).json({ result: true, message: "Faculties registered with some errors. Check the downloaded file for invalid records.", invalidRecords });
        }
        else {
            // If there are no invalid records, send success response
            res.status(200).json({ result: true, message: "Faculties registered successfully." });
        }

    } catch (error) {
        console.error("Error registering students:", error);
        return res.status(500).json({ result: false, message: "An error occurred while registering Faculties . Please Check Your CSV File format.", error: error });
    }
    finally {
        fs.unlink(newfacultyCSVFilePath);
    }
}





const loginFaculty = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await Faculties.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ "message": "Email Does Not Exists.!", result: false });
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
                role: user.role,
                name: user.name,
                token: user.token
            }
        };

        const token = jwtToken.sign(data, SECRET_KEY);

        return res.status(200).json({ "message": "Logged in Successfully", data: user, result: true, token });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "message": "Some Error Occured", "result": false });
    }
}

const getFaculties = async (req, res) => {
    try {
        const searchQuery = req.query.search || "";
        const courseFilter = req.query.course || "";
        const page = parseInt(req.query.page) || 1; // Current page, default is 1
        const limit = parseInt(req.query.limit) || 10; // Number of items per page, default is 10

        // Define the search criteria
        const searchCriteria = {
            $and: [
                searchQuery ? {
                    $or: [
                        { salutation: { $regex: searchQuery, $options: 'i' } },
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { phno: { $regex: searchQuery, $options: 'i' } },
                        { email: { $regex: searchQuery, $options: 'i' } },
                        { role: { $regex: searchQuery, $options: 'i' } }
                    ]
                } : {},
                courseFilter ? { course: courseFilter } : {}
            ]
        };

        // Count total number of documents matching the search criteria
        const totalDocuments = await Faculties.countDocuments(searchCriteria);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalDocuments / limit);

        // Ensure the current page is within valid range
        const currentPage = Math.min(Math.max(page, 1), totalPages);

        // Calculate the number of documents to skip
        const skip = ((currentPage - 1) * limit) >= 0 ? ((currentPage - 1) * limit) : 0;

        // Find faculties based on search criteria with pagination and populate the 'course' field
        const data = await Faculties.find(searchCriteria)
            .populate('course') // Populate the 'course' field
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            message: "Faculties Data Fetched Successfully.",
            data: data,
            result: true,
            currentPage: currentPage,
            totalPages: totalPages,
            totalItems: totalDocuments
        });
    } catch (error) {
        console.error("Error fetching faculty data:", error);
        return res.status(500).json({ message: "Some Error Occurred.", result: false });
    }
};


const getIndividualFaculty = async (req, res) => {
    try {
        const id = req.user.id;

        // Find the faculty based on the user ID and populate the 'course' field
        const data = await Faculties.findOne({ _id: id }).populate('course');

        if (!data) {
            return res.status(404).json({ message: "Faculty not found.", result: false });
        }
        const user = {
            _id: data._id,
            salutation: data.salutation,
            name: data.name,
            courseId: data?.course?._id,
            course: data?.course?.courseName, // Now 'course' will be populated with course details
            phno: data.phno,
            email: data.email,
            profilePicName: data.profilePicName,
            profilePicPath: data.profilePicPath,
            role: data.role
        }

        return res.status(200).json({ "message": "Faculty Data Fetched Successfully.", "data": user, "result": true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Some Error Occurred", "result": false });
    }
}


const setUpSystem = async (req, res) => {

    try {
        const current_time = new Date();

        const { sadminsalutation, sadminemail, sadminname, sadminphno, sadminpassword, collegename } = req.body;

        const newCollegePdfBanner = req?.file;

        if (!newCollegePdfBanner) {
            return res.status(400).json({
                message: "Please Provide College Banner",
                result: false
            })
        }

        if (!phnoRegex.test(sadminphno)) {
            return res.status(400).json({
                message: "Please Provide a valid phone no.!",
                result: false
            })
        }


        if (sadminsalutation.trim().length == 0) {
            return res.status(400).json({
                message: "Please Provide a admin salutation.!",
                result: false
            })
        }

        if (collegename.trim().length == 0) {
            return res.status(400).json({
                message: "Please Provide a valid College Name.!",
                result: false
            })
        }

        if (!nameRegex.test(sadminname)) {
            return res.status(400).json({
                message: "Please Provide a valid super admin name!",
                result: false
            })
        }

        if (!emailRegex.test(sadminemail)) {
            return res.status(400).json({
                message: "Please Provide a valid super admin Email!",
                result: false
            })
        }

        const newCollegePDFBannerName = newCollegePdfBanner.originalname;
           
            // const result = await uploadToCloudinary(newCollegePdfBanner.path, "image");
            // if (result.message === "Fail") {
            //     return res.status(500).json({
            //         message: "Some Error Occued...",
            //         result: false
            //     })
            // }
            // const newCollegePDFBannerPath = result.url;
            const newCollegePDFBannerPath  = `uploads/${current_time}-${newCollegePDFBannerName}`;
             try{
         
                 fs.renameSync(newCollegePdfBanner.path,newCollegePDFBannerPath);
         
             }catch(err){
                console.log(err)
                return res.status(500).json({
                    message: "Some Error Occued...",
                    result: false
                })
             }
             



        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(sadminpassword, salt);


        college = await College.create({
            collegename: collegename.trim(),
            collegePdfBannerName: newCollegePDFBannerName,
            collegePdfBannerPath: newCollegePDFBannerPath
        })

        user = await Faculties.create({
            name: sadminname.trim(),
            password: secPass,
            salutation: sadminsalutation,
            email: sadminemail.trim(),
            role: "Super Admin",
            phno: sadminphno.trim(),
            status: "Active",
            profilePicName: ".",
            profilePicPath: "."
        });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: sadminemail,
            subject: 'Successful Set Up Of CEMS and Admin Account.',
        
            html: `
                <html>
                    <head>
                        <style>
                            /* Define styles for your email */
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ccc;
                                border-radius: 10px;
                                background-color: #f9f9f9;
                            }
                            .header {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                text-align: center;
                                font-size: 24px;
                                font-weight: bold;
                            }
                            p {
                                margin-bottom: 15px;
                                font-size: 18px;
                            }
                            .credentials {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                font-size: 18px;
                                margin-top: 20px;
                            }
                            .contact-support {
                                margin-top: 20px;
                                text-align: center;
                            }
                            .contact-support p {
                                font-size: 16px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">Congratulations, Admin!</div>
                            <p>
                                You have successfully set up the College Event Management System for your college.
                            </p>
                            <p>
                                Your login credentials for CEMS are:
                            </p>
                            <div class="credentials">
                                <p>Email: ${sadminemail}</p>
                                <p>Password: ${sadminpassword}</p>
                                <p>Now you can manage various aspects of the system:</p>
                                <ul>
                                    <li>Add students</li>
                                    <li>Add faculties</li>
                                    <li>Add courses</li>
                                    <li>Add events</li>
                                    <li>Add event types</li>
                                </ul>
                            </div>
                            <div class="contact-support">
                                <p>If you have any questions or need further assistance, please contact support.</p>
                            </div>
                            <p>Best regards,</p>
                            <p>The CEMS Team</p>
                        </div>
                    </body>
                </html>
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

        return res.status(200).json({ "message": "System Set Up Successfull.!", "result": true });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ "result": false, "message": "Some Error Occured" });
    }

}

const facultyForgotPassword = async (req, res) => {

    try {

        const { email } = req.body;
        const facultyData = await Faculties.findOne({ email: email });
        if (!facultyData) {
            return res.status(400).json({
                message: "Email Id Not Registered.",
                result: false
            })
        }

        const otp = generateOTP();

        client.set(email, otp);



        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: 'OTP Verification',
            html: `
                <html>
                    <head>
                        <style>
                            /* Define styles for your email */
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ccc;
                                border-radius: 10px;
                                background-color: #f9f9f9;
                            }
                            .header {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                text-align: center;
                                font-size: 24px;
                                font-weight: bold;
                            }
                            p {
                                margin-bottom: 15px;
                                font-size: 18px;
                            }
                            .credentials {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                font-size: 18px;
                                margin-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            
                            <div class="credentials">
    <p>                            Your OTP for CEMS is ${otp}. </p>

                                <p>Don't Share it with anyone..</p>
                            </div>
                            <p>From CEMS.</p>
                        </div>
                    </body>
                </html>
            `
        };
        // Send email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.status(500).json({
                    message: "Unable to send Email",
                    result: false
                })
            } else {
                return res.status(200).json({
                    message: "OTP Mailed Successfully",
                    result: true
                });

            }
        });


    } catch (error) {
        return res.status(500).json({
            message: "Some Error Occured",
            result: false
        })
    }

}

const verifyOTP = async (req, res) => {
    try {
        const userOTP = req.body.otp;
        const email = req.body.email;

        const generatedOTP = await client.get(email);
        if (generatedOTP === userOTP) {

            const facultydata = await Faculties.findOne({ email });

            const data = {
                user: {
                    _id: facultydata._id,
                    email:facultydata.email
                }
            };
            const token = jwtToken.sign(data, SECRET_KEY);

            await client.del(email);

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
        console.log(error);
        return res.status(500).json({
            message: "Some Error Occured",
            result: false
        })
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
        await Faculties.updateOne({ _id: userId }, { password: hashedPassword });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: req.user.email,
            subject: 'Password Reset',
        
            html: `
                <html>
                    <head>
                        <style>
                            /* Define styles for your email */
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ccc;
                                border-radius: 10px;
                                background-color: #f9f9f9;
                            }
                            .header {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                text-align: center;
                                font-size: 24px;
                                font-weight: bold;
                            }
                            p {
                                margin-bottom: 15px;
                                font-size: 18px;
                            }
                            .credentials {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                font-size: 18px;
                                margin-top: 20px;
                            }
                            .contact-support {
                                margin-top: 20px;
                                text-align: center;
                            }
                            .contact-support p {
                                font-size: 16px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <p>
                               Respected Faculty ,  Your Password has been Reset Recently.
                            </p>
                            <div class="credentials">
                                <p> Your New Password: ${newPassword} .</p>
                            </div>
                            
                            <div class="contact-support">
                                <p>If you have any questions or need further assistance, please contact support.</p>
                            </div>
                            <p>Best regards,</p>
                            <p>The CEMS Team</p>
                        </div>
                    </body>
                </html>
            `
        };
        
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.status(500).json({
                    message: "Unable to send Email",
                    result: false
                })
            } else {
                return res.status(200).json({
                    message: "Mail Sent Successfully",
                    result: true
                });

            }
        });

        return res.status(200).json({
            message: "Password Reset Successfully",
            result: true
        })

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            message: "Some Error Occured",
            result: false
        })
    }
}

const updateFacultyData = async (req, res) => {
    try {


        const { _id, course, name, phno, email, salutation, role } = req.body;

        const doesEmailAlreadyExists = await Faculties.findOne({ email: email, _id: { $ne: _id } })

        let doesPhnoAlreadyExists = await Faculties.findOne({ phno: phno, _id: { $ne: _id } });


        if (doesEmailAlreadyExists) {
            return res.status(400).json({
                message: "This Email is Already registered.",
                result: false
            })
        }
        if (doesPhnoAlreadyExists) {
            return res.status(400).json({
                message: "This Phone Number is Already registered.",
                result: false
            })
        }

        if (role !== "Super Admin" && !isValidObjectId(course)) {
            return res.status(400).json({
                message: "Provide Course .!",
                result: false
            })
        }





        const updatedFaculties = await Faculties.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    course: course,
                    salutation: salutation,
                    name: name,
                    phno: phno,
                    email: email
                }
            },
            { new: true } // To return the updated document
        ).populate('course');

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: 'Account Updated',
        
            html: `
                <html>
                    <head>
                        <style>
                            /* Define styles for your email */
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ccc;
                                border-radius: 10px;
                                background-color: #f9f9f9;
                            }
                            .header {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                text-align: center;
                                font-size: 24px;
                                font-weight: bold;
                            }
                            p {
                                margin-bottom: 15px;
                                font-size: 18px;
                            }
                            .credentials {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                font-size: 18px;
                                margin-top: 20px;
                            }
                            .contact-support {
                                margin-top: 20px;
                                text-align: center;
                            }
                            .contact-support p {
                                font-size: 16px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <p>
                               Respected Faculty ,  Your Data Has Been Successfully Updated By the Admin.
                            </p>
                            <div class="credentials">
                                <p>Your New Email Id and Phone Number.</p>
                                <p>Email: ${email}</p>
                                <p>Phone Number: ${phno}</p>
                            </div>
                            
                            <div class="contact-support">
                            <p>To check for updated data, please log in to your account.</p>
                                <p>If you have any questions or need further assistance, please contact support.</p>
                            </div>
                            <p>Best regards,</p>
                            <p>The CEMS Team</p>
                        </div>
                    </body>
                </html>
            `
        };
        
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.status(500).json({
                    message: "Unable to send Email",
                    result: false
                })
            } else {
                return res.status(200).json({
                    message: "Mail Sent Successfully",
                    result: true
                });

            }
        });

        // Return success response with updated student data
        return res.status(200).json({
            message: "Faculty data updated successfully.",
            result: true,
            updatedFaculties: updatedFaculties
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating student data.",
            result: false
        });
    }
}

const changeFacultyProfilePic = async (req, res) => {
    try {
const current_time =  new Date();
        const profilePic = req.file;
        if (!profilePic) {
            return res.status(400).json({
                message: "Please Provide Profile Photo",
                result: false
            })
        }
        const userData = await Faculties.findOne({ _id: req.user.id })



        const profilePicName = profilePic.originalname;
        // const result = await uploadToCloudinary(profilePic.path, "image");
        // if (result.message === "Fail") {
        //     return res.status(500).json({
        //         message: "Some Error Occued...",
        //         result: false
        //     })
        // }
        // const newProfilePicPath = result.url;

        const newProfilePicPath = `uploads/${current_time}-${profilePicName}`;
        try{
    
            fs.renameSync(profilePic.path,newProfilePicPath);
    
        }catch(err){
           console.log(err)
           return res.status(500).json({
               message: "Some Error Occued...",
               result: false
           })
        }
        
        if (userData.profilePicName !== ".") {
            // const publicId = userData.profilePicPath.split('/').slice(-1)[0].split('.')[0];
            // await deleteFromCloudinary(publicId);
            fs.unlinkSync(userData.profilePicPath)
        }


        const updatedData = await Faculties.updateOne(
            { _id: req.user.id },
            {
                $set: {
                    profilePicName: profilePicName,
                    profilePicPath: newProfilePicPath
                }
            },
            { new: true }
        )

        console.log(updatedData)

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

        const user = await Faculties.findOne({ _id: userId });

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

        const userData = await Faculties.updateOne(
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
            subject: 'Password Changed',
        
            html: `
                <html>
                    <head>
                        <style>
                            /* Define styles for your email */
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                border: 1px solid #ccc;
                                border-radius: 10px;
                                background-color: #f9f9f9;
                            }
                            .header {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                text-align: center;
                                font-size: 24px;
                                font-weight: bold;
                            }
                            p {
                                margin-bottom: 15px;
                                font-size: 18px;
                            }
                            .credentials {
                                background-color: #4299e1; /* Tailwind bg-blue-500 */
                                padding: 10px;
                                border-radius: 5px;
                                color: #ffd700; /* Golden color */
                                font-size: 18px;
                                margin-top: 20px;
                            }
                            .contact-support {
                                margin-top: 20px;
                                text-align: center;
                            }
                            .contact-support p {
                                font-size: 16px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <p>
                               Dear Faculty ,  Your Password has been Changed Recently.
                            </p>
                            <div class="credentials">
                                <p> Your New Password: ${newPassword} .</p>
                            </div>
                            
                            <div class="contact-support">
                                <p>If you have any questions or need further assistance, please contact support.</p>
                            </div>
                            <p>Best regards,</p>
                            <p>The CEMS Team</p>
                        </div>
                    </body>
                </html>
            `
        };
        
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.status(500).json({
                    message: "Unable to send Email",
                    result: false
                })
            } else {
                return res.status(200).json({
                    message: "Mail Sent Successfully",
                    result: true
                });

            }
        });


        return res.status(200).json({ "message": "Password Updated  Successfully!", "result": true });


    } catch (error) {
        return res.status(500).json({ "message": "Some Error Occured!", "result": false });

    }
}

const changeFacultyStatus = async (req, res) => {

    try {
        const { id, newStatus } = req.body;

        if (!id || !newStatus) {
            return res.status(400).json({
                message: "Id and New Status is Required",
                result: false
            })
        }


        const newData = await Faculties.findOneAndUpdate(
            { _id: id },
            {
                $set:
                {
                    status: newStatus
                }
            },
            { new: true } // To return the updated document

        ).populate("course")

        return res.status(200).json({
            message: "Faculty Status Changed Successfully",
            result: true,
            updatedFacultyData: newData
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "message": "Some Error Occured!", "result": false });

    }

}

const countFacultiesByCourse = async (req, res) => {
    try {
        const pipeline = [
            // Group by course and count documents
            {
                $group: {
                    _id: "$course",
                    count: { $sum: 1 }
                }
            },
            // Lookup to join with the Course collection
            {
                $lookup: {
                    from: "courses", // Name of the Course collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            // Project to reshape the output
            {
                $project: {
                    _id: 0,
                    course: {
                        _id: "$_id",
                        courseName: { $arrayElemAt: ["$courseDetails.courseName", 0] } // Get the course name from the array
                    },
                    count: 1
                }
            }
        ];

        // Execute the aggregation pipeline
        const result = await Faculties.aggregate(pipeline);

        // Return the result
        return res.status(200).json({ message: "Faculties Fetched Successfully.", data: result, result: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Some Error Occurred", result: false });
    }
};

const registerFireBaseToken = async (req, res) => {

    try {

        const { token, _id } = req.body;

        if (!isValidObjectId(_id)) {
            return res.status(400).json({
                message: "Invalid User",
                result: false
            })
        }

        const updatedData = await Faculties.findOneAndUpdate(
            { _id: _id },
            {
                $set
                    :
                {
                    token: token
                }
            }
        )

        return res.status(200).json({
            message: "Token Registered Successfully",
            result: true
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Some Error Occurred", result: false });
    }

}




module.exports = {
    registerIndividualFaculties,
    registerFacultiesInBulk,
    loginFaculty,
    getFaculties,
    setUpSystem,
    getIndividualFaculty,
    facultyForgotPassword,
    verifyOTP,
    resetPassword,
    updateFacultyData,
    changeFacultyProfilePic,
    changePassword,
    changeFacultyStatus,
    countFacultiesByCourse,
    registerFireBaseToken
};