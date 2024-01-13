const jwtToken = require("jsonwebtoken");
const bycrypt = require("bcrypt");
const Faculties = require("../models/Faculties");
const College = require("../models/College");

const SECRET_KEY = process.env.SECRET_KEY;

const registerUser = async(req,res)=>{
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


const loginUser = async(req,res)=>{
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
                type:user.role
            }
         };

         const token = jwtToken.sign(data,SECRET_KEY);

         return res.status(200).json({"message":"Logged in Successfully",result:true,token});

    } catch (error) {
        
        return res.status(400).json({"message":"Error Occured"});
    }
}

const getFaculties = async(req,res)=>{
        try {
            const data = await Faculties.find({});
            return res.status(200).json({"message":"Faculties Data Fetched Successfully.","data":data,"result":true})
        } catch (error) {
            return res.status(400).json({"message":"Some Error Occured.","result":false})
        }
}


const setUpSystem =  async(req,res)=>{

    try {

        const salt = await bycrypt.genSalt(10);
        const secPass = await bycrypt.hash(req.body.password,salt);

        college = await College.create({
            collegename:req.collegename.trim()
        })
        
        user = await Faculties.create({
            name:req.body.name.trim(),
            password:secPass,
            email:req.body.email.trim(),
            role:"Super Admin",
            phno:req.body.phno.trim()
        });

        return res.status(200).json({"message":"System Set Up Successfull.!","result":true});


    } catch (error) {
        return res.status(400).json({"result":false,"message":"Some Error Occured"});
    }

}


module.exports = {
    registerUser,
    loginUser,
    getFaculties,
    setUpSystem
};