import { PDFViewer } from "@react-pdf/renderer";
import React from 'react'
import ParticipationListPdf from "./ParticipationListPdf";
import AllEventResultList from "./AllEventResultList";

export default function ViewPdf({eventData, registrationData, collegeData,eventAnalytics ,fromDate={fromDate} ,toDate={toDate} , eventType={eventType}}) {
    return (
        <div>
            <PDFViewer width="1000" height="650" className="app" >
                {/* <ParticipationListPdf eventData={eventData} registrationData={registrationData} collegeData={collegeData} /> */}
                <AllEventResultList collegeData={collegeData} eventAnalytics={eventAnalytics} fromDate={fromDate} toDate={toDate}  eventType={eventType}/>
            </PDFViewer>
        </div>
    )
}


