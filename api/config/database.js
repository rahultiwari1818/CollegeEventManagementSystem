const mongoose = require("mongoose");
const url = process.env.DB_URL;

const connectToMongo = () => {
    try {

        mongoose.connect(url);
    } catch (error) {

        console.log(error)
        return res.status(500).json({ "message": "Some Error Occured.!", "result": false });
    }
}

module.exports = connectToMongo;

