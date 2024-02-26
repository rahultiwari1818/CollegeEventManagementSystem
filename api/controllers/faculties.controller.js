const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Faculties = require("../models/Faculties");
const College = require("../models/College");
const fs = require("fs").promises;
const path = require("path");
const csvtojson = require("csvtojson");
const transporter = require("../config/mailTransporter");
const { generateOTP, uploadToCloudinary, deleteFromCloudinary } = require("../utils");
const { client } = require("../config/redisConfig");

const SECRET_KEY = process.env.SECRET_KEY;

const registerIndividualFaculties = async(req,res)=>{
    try {

        const {name,email,phno,course,password,salutation} = req.body;

        let user = await Faculties.findOne({email:email});
        if(user){
            return res.status(400).json({"message":"Email Already registered.!","result":false});
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
            const result = await uploadToCloudinary(profilePic.path, "image");
            profilePicPath = result.url;
        }




        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password,salt);


        user = await Faculties.create({
            salutation:salutation.trim(),
            name:name.trim(),
            password:secPass,
            email:email.trim(),
            role:"Faculty",
            phno:phno.trim(),
            course:course.trim(),
            profilePicName:profilePicName,
            profilePicPath:profilePicPath,
            status:"Active"

        });
        

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: 'Successfull Registration in CEMS',
            text: `Your Login Credentials are for CEMS are:
                email : ${email} and Password : ${password}.
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

        return res.status(200).json({"message":"Faculty Registered Successfully!","result":true});


        
    } catch (error) {
        console.log(error)
        return res.status(500).json({"message":"Error Occured",result:false});
    }
}


const registerFacultiesInBulk = async(req,res) =>{
    let newfacultyCSVFilePath= "";
    try {
        const facultyCSVFile = req.file;
         newfacultyCSVFilePath = `uploads/${facultyCSVFile.originalname}${path.extname(facultyCSVFile.originalname)}`
         await fs.rename(facultyCSVFile.path,newfacultyCSVFilePath)
        const source = await csvtojson().fromFile(`./uploads/${facultyCSVFile.originalname}${path.extname(facultyCSVFile.originalname)}`); // await the csvtojson promise

        const arrayToInsert = source.map(entry => ({
            profilePicName:".",
            profilePicPath:".",
            salutation:entry["saultation"],
            name:entry["name"],
            email:entry["email"],
            phno:entry["mobile"],
            role:"Faculty",
            course:entry["course"],
            password:entry["email"],
            status:"Active"
        }));
        const result = await Faculties.insertMany(arrayToInsert);
       return res.status(200).json({ success: true, message: "Faculties registered successfully." });
    } catch (error) {
        // console.error("Error registering students:", error);
       return res.status(500).json({ success: false, message: "An error occurred while registering Faculties . Please Check Your CSV File format.",error:error });
    }
    finally{
        fs.unlink(newfacultyCSVFilePath);
    }
}





const loginFaculty = async(req,res)=>{
    const {email,password} = req.body;
    try {
        
        const user = await Faculties.findOne({email:email})

        if(!user){
            return res.status(400).json({"message":"Email Does Not Exists.!",result:false});
        }

        const comparedPassword = await bcrypt.compare(password,user.password);
         if(!comparedPassword){
            return res.status(400).json({"message":"Invalid Password",result:false});
         }
         
         const data = {
            user:{
                id:user._id,
                role:user.role,
                name:user.name,
            }
         };

         const token = jwtToken.sign(data,SECRET_KEY);

         return res.status(200).json({"message":"Logged in Successfully",data:user,result:true,token});

    } catch (error) {
        
        return res.status(400).json({"message":"Error Occured",result:false});
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
                        { course: { $regex: searchQuery, $options: 'i' } },
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
        const skip = (currentPage - 1) * limit;
    
        // Find faculties based on search criteria with pagination
        const data = await Faculties.find(searchCriteria).skip(skip).limit(limit);
    
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
        return res.status(400).json({ message: "Some Error Occurred.", result: false });
    }
    
};

const getIndividualFaculty =  async(req,res)=>{
    try {

        const id = req.user.id;
        const data = await Faculties.findOne({_id:id})
        const user = {
            _id:data._id,
            salutation:data.salutation,
            name:data.name,
            course:data.course,
            phno:data.phno,
            email:data.email,
            profilePicName:data.profilePicName,
            profilePicPath:data.profilePicPath
        }

        return res.status(200).json({"message":"Faculty Data Fetched Successfully.","data":user,"result":true})
    } catch (error) {
        console.log(error)
    }
}

const setUpSystem =  async(req,res)=>{

    try {


        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.sadminpassword,salt);

        college = await College.create({
            collegename:req.body.collegename.trim()
        })
        
        user = await Faculties.create({
            name:req.body.sadminname.trim(),
            password:secPass,
            email:req.body.sadminemail.trim(),
            role:"Super Admin",
            course:"All",
            phno:req.body.sadminphno.trim(),
            status:"Active",
            profilePicName:".",
            profilePicPath:"."
        });

        return res.status(200).json({"message":"System Set Up Successfull.!","result":true});


    } catch (error) {
        console.log(error)
        return res.status(400).json({"result":false,"message":"Some Error Occured"});
    }

}

const facultyForgotPassword = async(req,res)=>{

    try {
        
        const {email} = req.body;
        const facultyData = await Faculties.findOne({email:email});
        if(!facultyData){
            return res.status(400).json({
                message:"EmailId Not Registered.",
                result:false
            })
        }

        const otp = generateOTP();

        client.set(email, otp);


        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: 'OTP for Forgot Password in CEMS',
            text: `Your OTP for CEMS is ${otp}. Dont share it with anyone.`
        };
        
        // Send email
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return res.status(500).json({
                    message:"Unable to send Email",
                    result:false
                })
            } else {
                return res.status(200).json({
                    message:"OTP Mailed Successfully",
                    result:true
                });
        
            }
        });


    } catch (error) {
        
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
                    _id: facultydata._id
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
        console.log(error)
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

        return res.status(200).json({
            message: "Password Reset Successfully",
            result: true
        })

    } catch (error) {
        console.log(error)
    }
}

const updateFacultyData = async(req,res)=>{
    try {


        const { _id, course, name, phno, email ,salutation} = req.body;

        const doesEmailAlreadyExists = await Faculties.findOne({ email: email, _id: { $ne: _id } })

        if (doesEmailAlreadyExists) {
            return res.status(400).json({
                message: "This Email is Already registered.",
                result: false
            })
        }




        const updatedFaculties = await Faculties.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    course: course,
                    salutation:salutation,
                    name: name,
                    phno: phno,
                    email: email
                }
            },
            { new: true } // To return the updated document
        );

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

const changeFacultyProfilePic = async(req,res)=>{
    try {
        
        const profilePic = req.file;
        if(!profilePic){
            return res.status(400).json({
                message:"Please Provide Profile Photo",
                result:false
            })
        }
        const userData = await Faculties.findOne({_id:req.user.id})
        


        const profilePicName = profilePic.originalname;
        const result = await uploadToCloudinary(profilePic.path, "image");
        if(result.message==="Fail"){
            return res.status(500).json({
                message:"Some Error Occued...",
                result:false
            })
        }
        const newProfilePicPath = result.url;

        if(userData.profilePicName !== "."){
            const publicId = userData.profilePicPath.split('/').slice(-1)[0].split('.')[0];
            await deleteFromCloudinary(publicId);
        }


        const updatedData = await Faculties.updateOne(
            { _id: req.user.id },
            {
                $set: {
                    profilePicName:profilePicName,
                    profilePicPath:newProfilePicPath
                }
            },
            { new: true } 
        )
        
        console.log(updatedData)

        return res.status(200).json({
            message:"Profile Photo Uploaded Sucessfully",
            result:true,
            data:{
                profilePicPath:newProfilePicPath,
                profilePicName
            }
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Some Error Occured",
            result:true
        })
    }

}

const changePassword = async(req,res)=>{
    try {
        
        const {currentPassword,newPassword} = req.body;
        const userId = req.user.id;

        const user = await Faculties.findOne({_id:userId});

        if(!user){
            return res.status(400).json({
                message:"Invalid User",
                result:false
            })
        }

        const comparedPassword = await bcrypt.compare(currentPassword,user.password);
         if(!comparedPassword){
            return res.status(400).json({"message":"Invalid Password",result:false});
         }
         
         const salt = await bcrypt.genSalt(10);
         const secPass = await bcrypt.hash(newPassword,salt);
         
         const userData = await Faculties.updateOne(
            {_id:userId},
            {
                $set:{
                    password:secPass
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

        return res.status(200).json({"message":"Password Updated  Successfully!","result":true});


    } catch (error) {
        return res.status(500).json({"message":"Some Error Occured!","result":false});

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
    changePassword
};