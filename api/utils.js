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
  
    var mainFolderName = "main"; 
    // filePathOnCloudinary: path of image we want 
    // to set when it is uploaded to cloudinary 
    var filePathOnCloudinary =  
        mainFolderName + "/" + locaFilePath; 
  
    return cloudinary.uploader 
        .upload(locaFilePath, {
            folder: filePathOnCloudinary,
            resource_type: resource_type // Automatically detect the resource type
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
            console.log(error)
            // Remove file from local uploads folder 
            // fs.unlink(locaFilePath); 
            return { message: "Fail" }; 
        }); 
} 

module.exports = {storage,uploadToCloudinary};