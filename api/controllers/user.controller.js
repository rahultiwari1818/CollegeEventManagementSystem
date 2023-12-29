const jwtToken = require("jsonwebtoken");
const bycrypt = require("bcrypt");
const Users = require("../models/Users");

const SECRET_KEY = process.env.SECRET_KEY;

const registerUser = async(req,res)=>{
    try {

        let user = await Users.findOne({email:req.body.email});

        if(user){
            return res.status(400).json({"message":"Email Already registered.!","result":false});
        }

        const salt = await bycrypt.genSalt(10);
        const secPass = await bycrypt.hash(req.body.password,salt);

        user = await Users.create({
            name:req.body.name.trim(),
            password:secPass,
            email:req.body.email.trim(),
            userType:req.body.userType.trim()
        });
        

        return res.status(200).json({"message":"User Created Successfully.!","result":true});


        
    } catch (error) {
        return res.status(400).json({"message":"Error Occured"});
    }
}


const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try {
        
        const user = await Users.findOne({email:email})

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
                type:user.userType
            }
         };

         const token = jwtToken.sign(data,SECRET_KEY);

         return res.status(200).json({"message":"Logged in Successfully",result:true,token});

    } catch (error) {
        
        return res.status(400).json({"message":"Error Occured"});
    }
}

module.exports = {
    registerUser,
    loginUser
};