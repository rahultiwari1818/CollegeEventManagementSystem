const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const College = require("../models/College");

const SECRET_KEY = process.env.SECRET_KEY;

const checkIsLoggedIn = async (req, res) => {
    try {
        return res.status(200).json({ "message": "User Fetched Successfully", "user": req.user, "result": true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Some Error Occured",
            result: false
        })
    }
}




module.exports = {
    checkIsLoggedIn
};