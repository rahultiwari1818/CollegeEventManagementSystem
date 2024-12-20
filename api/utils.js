const multer = require("multer");
const cloudinary = require("cloudinary").v2; 
const fs = require("fs").promises;

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_SECRET_KEY 
  });



const storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
        cb(null, "./uploads"); 
    }, 
    filename: function (req, file, cb) { 
        cb(null, file.originalname); 
    }, 
}); 

async function uploadToCloudinary(locaFilePath,resource_type) { 
  
    // locaFilePath: path of image which was just 
    // uploaded to "uploads" folder 
  
    
  
    return cloudinary.uploader 
        .upload(locaFilePath, {
            folder: "main",
            resource_type: "auto" // Automatically detect the resource type
        }) 
        .then((result) => { 
  
            // Image has been successfully uploaded on 
            // cloudinary So we dont need local image  
            // file anymore 
            // Remove file from local uploads folder 
            fs.unlink(locaFilePath); 
  
            return { 
                message: "Success", 
                url: result.url, 
            }; 
        }) 
        .catch((error) => { 
            console.log(error,"res",resource_type)
            // Remove file from local uploads folder 
            // fs.unlink(locaFilePath); 
            return { message: "Fail" }; 
        }); 
} 

async function deleteFromCloudinary(publicId) {
    try {
        const result = await cloudinary.uploader.destroy("main/"+publicId);
        return true;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return false;
    }
}

function generateOTP() {
    const length = 6;
    const otp = Math.floor(Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1)) + Math.pow(10, length - 1));
    return otp.toString();
}

function parseBoolean(string) {
    return string === "true" ? true : string === "false" ? false : undefined;
  };

module.exports = {storage,uploadToCloudinary,deleteFromCloudinary,generateOTP,parseBoolean};