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
const fetchUser = require("../middlewares/fetchUser.js");




router.post("/generateevent",fetchUser,upload.single("eposter"),upload.single("ebrochure"),generateEvent);

router.post("/generateSubEvent/:masterEventId",fetchUser,async()=>{

})

router.get("/getevents",fetchUser,getAllEvents);

router.get("/getSpecificEvent/:id",fetchUser,getSpecificEvent);

router.patch("/changeEventStatus/:id",fetchUser,changeEventStatus);

router.patch("/updateEventDetails/:id",fetchUser,updateEventDetails);

router.post("/registerInEvent",fetchUser,async()=>{

})

router.post("/declareResult/:eventId",fetchUser,async()=>{

})

module.exports = router;