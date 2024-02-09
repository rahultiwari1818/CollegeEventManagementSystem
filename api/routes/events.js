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
const checkIsAdmin = require("../middlewares/checkIsAdmin.js");




router.post("/generateevent", checkIsAdmin, upload.fields([{ name: 'eposter' }, { name: 'ebrochure' }]), generateEvent);


router.get("/getevents",fetchUser,getAllEvents);

router.get("/getSpecificEvent/:id",fetchUser,getSpecificEvent);

router.patch("/changeEventStatus/:id",checkIsAdmin,changeEventStatus);

router.patch("/updateEventDetails/:id",checkIsAdmin,upload.fields([{ name: 'eposter' }, { name: 'ebrochure' }]),updateEventDetails);

router.post("/registerInEvent",fetchUser,async()=>{

})

router.post("/declareResult/:eventId",checkIsAdmin,async()=>{

})

module.exports = router;