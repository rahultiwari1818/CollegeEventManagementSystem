const mongoose = require("mongoose");
const url = process.env.DB_URL;

const connectToMongo = () =>{
    mongoose.connect(url);
    // console.log("server is running")
}

module.exports = connectToMongo;

