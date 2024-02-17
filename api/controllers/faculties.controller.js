const jwtToken = require("jsonwebtoken");
const bycrypt = require("bcrypt");
const Faculties = require("../models/Faculties");
const College = require("../models/College");
const fs = require("fs").promises;
const path = require("path");
const csvtojson = require("csvtojson");

const SECRET_KEY = process.env.SECRET_KEY;

const registerIndividualFaculties = async(req,res)=>{
    try {

        let user = await Faculties.findOne({email:req.body.email});

        if(user){
            return res.status(400).json({"message":"Email Already registered.!","result":false});
        }

        const salt = await bycrypt.genSalt(10);
        const secPass = await bycrypt.hash(req.body.password,salt);

        user = await Faculties.create({
            name:req.body.name.trim(),
            password:secPass,
            email:req.body.email.trim(),
            role:req.body.userType.trim(),
            phno:req.body.phno.trim()
        });
        

        return res.status(200).json({"message":"User Created Successfully.!","result":true});


        
    } catch (error) {

        return res.status(400).json({"message":"Error Occured"});
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
            salutation:entry["saultation"],
            name:entry["dname"]+" "+entry["mname"]+" "+entry["lname"],
            email:entry["mailid"],
            phno:entry["mobile"],
            role:"Faculty",
            course:entry["course"],
            password:entry["mailid"]
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
            return res.status(400).json({"message":"Email Does Not Exists.!"});
        }

        const comparedPassword = await bycrypt.compare(password,user.password);
         if(!comparedPassword){
            return res.status(400).json({"message":"Invalid Password"});
         }
         
         const data = {
            user:{
                id:user._id,
                type:user.role,
                name:user.name,
            }
         };

         const token = jwtToken.sign(data,SECRET_KEY);

         return res.status(200).json({"message":"Logged in Successfully",data:user,result:true,token});

    } catch (error) {
        
        return res.status(400).json({"message":"Error Occured"});
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

const getSpecificFacultyDetail =  async(req,res)=>{
    try {
        return res.status(200).json({"message":"Faculty Data Fetched Successfully.","data":req.user,"result":true})
    } catch (error) {
        
    }
}

const setUpSystem =  async(req,res)=>{

    try {


        const salt = await bycrypt.genSalt(10);
        const secPass = await bycrypt.hash(req.body.sadminpassword,salt);

        college = await College.create({
            collegename:req.body.collegename.trim()
        })
        
        user = await Faculties.create({
            name:req.body.sadminname.trim(),
            password:secPass,
            email:req.body.sadminemail.trim(),
            role:"Super Admin",
            course:"All",
            phno:req.body.sadminphno.trim()
        });

        return res.status(200).json({"message":"System Set Up Successfull.!","result":true});


    } catch (error) {
        console.log(error)
        return res.status(400).json({"result":false,"message":"Some Error Occured"});
    }

}


module.exports = {
    registerIndividualFaculties,
    registerFacultiesInBulk,
    loginFaculty,
    getFaculties,
    setUpSystem
};