const jwtToken = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const checkIsFaculty = async(req,res,next) =>{


    try {

    const authToken = req.header("auth-token");
    if(!authToken){
        return res.status(401).json({"message":"Unauthorized User.","error":true});
    }
        
        const data = jwtToken.verify(authToken,SECRET_KEY);
        req.user = data.user;
        if(data.user.role!=="Faculty"  && data.user.role!=="Super Admin" && data.user.role !== "Admin"){
            return res.status(401).json({"message":"Unauthorized User.","result":false});
        }
        
        next();

    } catch (error) {
        console.log(error)
        return res.status(500).json({"message":"Some Error Occured.!","result":false});
    }

};

module.exports = checkIsFaculty;