const jwtToken = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const checkIsAdmin = async(req,res,next) =>{


    try {
        const authToken = req.header("auth-token");

        if(!authToken){
            return res.status(401).json({"message":"Unauthorized User.","result":false});
        }
    
        
        const data = jwtToken.verify(authToken,SECRET_KEY);
        if(data.user.role!=="Super Admin" && data.user.role !== "Admin"){
            return res.status(401).json({"message":"Unauthorized User.","result":false});
        }
        
        req.user = data.user;
        next();

    } catch (error) {
        console.log(error)
        return res.status(500).json({"message":"Some Error Occured.!","result":false});
    }

};

module.exports = checkIsAdmin;