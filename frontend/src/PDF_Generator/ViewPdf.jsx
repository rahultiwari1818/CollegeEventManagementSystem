import { PDFViewer } from "@react-pdf/renderer";
import React from 'react'
import ParticipationListPdf from "./ParticipationListPdf";

export default function ViewPdf() {
    return (
        <div>
            <PDFViewer width="1000" height="650" className="app" >
                <ParticipationListPdf />
            </PDFViewer>
        </div>
    )
}


