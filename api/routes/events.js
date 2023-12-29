const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const upload = multer({dest:"uploads/"});
const {
    generateEvent,
    getAllEvents,
    getSpecificEvent,
    changeEventStatus,
    updateEventDetails
} = require("../controllers/events.controller.js");

router.post("/generateevent",upload.single("ebrochure"),generateEvent);

router.get("/getevents",getAllEvents);

router.get("/getSpecificEvent/:id",getSpecificEvent);

router.patch("/changeEventStatus/:id",changeEventStatus);

router.patch("/updateEventDetails/:id",updateEventDetails);

module.exports = router;