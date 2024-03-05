import { PDFViewer } from "@react-pdf/renderer";
import React from 'react'
import ParticipationListPdf from "./ParticipationListPdf";

export default function ViewPdf({eventData, registrationData, collegeData}) {
    return (
        <div>
            <PDFViewer width="1000" height="650" className="app" >
                <ParticipationListPdf eventData={eventData} registrationData={registrationData} collegeData={collegeData} />
            </PDFViewer>
        </div>
    )
}


