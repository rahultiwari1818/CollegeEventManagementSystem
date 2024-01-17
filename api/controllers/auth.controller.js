const jwtToken = require("jsonwebtoken");
const bycrypt = require("bcrypt");
const College = require("../models/College");

const SECRET_KEY = process.env.SECRET_KEY;

const checkIsLoggedIn = async(req,res)=>{
    try {
        return res.status(200).json({"message":"User Fetched Successfully","user":req.user,"result":true})
    } catch (error) {

    }
}


module.exports = {
    checkIsLoggedIn
};