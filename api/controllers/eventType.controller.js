
const addEventType = async(req,res)=>{

    try {
        const eventTypeLogo = req.file;
        const {eventType} = req.body;
        if(!eventTypeLogo){
            return res.status(400).json({
                message:"EventType's Logo is Required.! ",
                result:false
            })
        }
        if(eventType.trim()===""){
            return res.status(400).json({
                message:"EventType Name is Required.! ",
                result:false
            }) 
        }
        let eventLogoName = "";
        let eventLogoPath = "";
    } catch (error) {
        
    }
    finally{
        
    }

}

module.exports = {addEventType};