const { isValidObjectId } = require("mongoose");
const EventType = require("../models/EventType");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils");

const addEventType = async(req,res)=>{

    try {
        const eventTypeLogo = req?.file;
        const {eventTypeName} = req.body;
        const courseWiseFaculties = JSON.parse(req.body.courseWiseFaculties) || [];

        if(!eventTypeLogo){
            return res.status(400).json({
                message:"EventType's Logo is Required.! ",
                result:false
            })
        }
        if(eventTypeName.trim()===""){
            return res.status(400).json({
                message:"EventType Name is Required.! ",
                result:false
            }) 
        }


        let eventLogoPath = "";
        const eventLogoName = eventTypeLogo ? eventTypeLogo.originalname : "";

        if(eventTypeLogo){
            const result = await uploadToCloudinary(eventTypeLogo.path,"image");
            eventLogoPath = result.url;
        }

        const eventType = await EventType.create({
            eventTypeName:eventTypeName.trim(),
            eventTypeLogo:eventLogoName,
            eventTypeLogoPath:eventLogoPath,
            committeeMembers:courseWiseFaculties
        })

        return res.status(200).json({
            message:"New Event Type Created Successfully.",
            result:true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ "message": "Some Error Occured", "result": false });
    }
    

}

const getAllEventTypes = async (req, res) => {
    try {
        const data = await EventType.find().populate({
            path: "committeeMembers",
            populate: {
                path: "course",
            },
            select: "-password" // Exclude the password field from the populated committeeMembers
        });
        return res.status(200).json({
            message: "All EventTypes Fetched Successfully",
            data: data,
            result: true
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Some Error Occurred",
            result: false
        });
    }
};

const updateEventType = async(req,res) =>{
    try {

        const {id,eventTypeName,courseWiseFaculties,eventTypeLogoPath,eventTypeLogo} = req.body;

        const newEventTypeLogo = req?.file;
        let newEventTypeLogoName ;
        let newEventTypeLogoPath;








        if(!id || (!isValidObjectId(id))){
            return res.status(400).json({
                message:"Invalid Id Provided",
                result:false
            })

        }

        if(eventTypeName.trim()===""){
            return res.status(400).json({
                message:"EventType Name is Required.! ",
                result:false
            }) 
        }

        if(newEventTypeLogo){
            newEventTypeLogoName = newEventTypeLogo.originalname;
            const result = await uploadToCloudinary(newEventTypeLogo.path, "image");
            if (result.message === "Fail") {
                return res.status(500).json({
                    message: "Some Error Occued...",
                    result: false
                })
            }
            newEventTypeLogoPath = result.url;
            const publicId = eventTypeLogoPath.split('/').slice(-1)[0].split('.')[0];
            await deleteFromCloudinary(publicId);
        }



        if(!newEventTypeLogo){
            newEventTypeLogoPath = eventTypeLogoPath;
            newEventTypeLogoName = eventTypeLogo;
        }


        const committeeMembers = JSON.parse(courseWiseFaculties) || [];

        const updatedData = await EventType.findOneAndUpdate(
            {_id:id},
            {
                $set : {
                    eventTypeName:eventTypeName,
                    committeeMembers:committeeMembers,
                    eventTypeLogoPath:newEventTypeLogoPath,
                    eventTypeLogo:newEventTypeLogoName
                }
            }
        )



        
        return res.status(200).json({
            message: "Event Type Updated Successfully",
            result: true
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Some Error Occurred",
            result: false
        });
    }
}



module.exports = {addEventType,
    getAllEventTypes,
    updateEventType
};