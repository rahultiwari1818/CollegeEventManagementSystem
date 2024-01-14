const jwtToken = require("jsonwebtoken");
const bycrypt = require("bcrypt");
const College = require("../models/College");

const SECRET_KEY = process.env.SECRET_KEY;

const checkSetUp = async(req,res)=>{
    try {
        const data = await College.find({});
        if(data.length > 0){
            return res.status(200).json({"message":"College Fetched Successfully","isSetUp":true})
        }
        else{

            return res.status(200).json({"message":"Need Set Up First.","isSetUp":false})
        }
    } catch (error) {
        
    }
}


module.exports = {
    checkSetUp
};