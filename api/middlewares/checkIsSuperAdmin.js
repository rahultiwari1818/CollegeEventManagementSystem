const jwtToken = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const checkIsSuperAdmin = async(req,res,next) =>{

    const authToken = req.header("auth-token");

    if(!authToken){
        return res.status(401).json({"message":"Unauthorized User.","result":false});
    }

    try {
        
        const data = jwtToken.verify(authToken,SECRET_KEY);
        if(data.user.role!=="Super Admin"){
            return res.status(401).json({"message":"Unauthorized User.","result":false});
        }
        
        req.user = data.user;
        next();

    } catch (error) {
        return res.status(401).json({"message":"Unauthorized User.!","result":false});
    }

};

module.exports = checkIsSuperAdmin;