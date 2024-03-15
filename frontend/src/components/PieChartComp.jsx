import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';


export default function PieChartComp({ data, sId,courseWise}) {

    const [participationData,setParticipationData] = useState({
        legendData:[],
        pieChartData:[]
    });
    useEffect(()=>{
        const formattedData = courseWise ? 
        data?.approvedParticipation.reduce((acc, participation) => {
            const courseId = participation.studentData.at(0).course._id;
            const courseName = participation.studentData.at(0).course.courseName;
            if(sId && sId == participation.sId ){
                if (acc[courseId]) {
                    acc[courseId].count++;
                } else {
                    acc[courseId] = {
                        courseName: courseName,
                        count: 1
                    };
                }
            }
            else if(!sId){
                if (acc[courseId]) {
                    acc[courseId].count++;
                } else {
                    acc[courseId] = {
                        courseName: courseName,
                        count: 1
                    };
                }
            }
            return acc;
        }, {})
        :
        data?.approvedParticipation.reduce((acc, participation) => {
            const subEventId = participation.sId;
            const subEventName = participation.subEventName;
                if (acc[subEventId]) {
                    acc[subEventId].count++;
                } else {
                    acc[subEventId] = {
                        subEventName: subEventName,
                        count: 1
                    };
                }
            
            return acc;
        }, {})
        ;

        const pieChartData = Object.values(formattedData).map((data, index) => ({
            name: courseWise ?  data.courseName : data?.subEventName,
            value: data.count,
            // For demonstration purposes, you can assign different colors to each course
            color: `#${Math.floor(Math.random() * 16977215).toString(16)}`,
        }));
        
        setParticipationData((old)=>({...old,pieChartData:pieChartData}))
        // Generate legends for each course
        const legendPayload = pieChartData.map((entry) => ({
            value: entry.name,
            color: entry.color,
        }));
        
        setParticipationData((old)=>({...old,legendData:legendPayload}))
    },[courseWise,data,sId])

    // const participationByCourse = data?.approvedParticipation.reduce((acc, participation) => {
    //     const courseId = participation.studentData.at(0).course._id;
    //     const courseName = participation.studentData.at(0).course.courseName;
    //     if(sId && sId == participation.sId ){
    //         if (acc[courseId]) {
    //             acc[courseId].count++;
    //         } else {
    //             acc[courseId] = {
    //                 courseName: courseName,
    //                 count: 1
    //             };
    //         }
    //     }
    //     else if(!sId){
    //         if (acc[courseId]) {
    //             acc[courseId].count++;
    //         } else {
    //             acc[courseId] = {
    //                 courseName: courseName,
    //                 count: 1
    //             };
    //         }
    //     }
    //     return acc;
    // }, {});

    // // Format the Data for the PieChart
    // const pieChartData = Object.values(participationByCourse).map((data, index) => ({
    //     name: data.courseName,
    //     value: data.count,
    //     // For demonstration purposes, you can assign different colors to each course
    //     color: `#${Math.floor(Math.random() * 16977215).toString(16)}`,
    // }));

    // // Generate legends for each course
    // const legendPayload = pieChartData.map((entry) => ({
    //     value: entry.name,
    //     color: entry.color,
    // }));

    return (
        <section>
            <PieChart width={350} height={400}>
                <Pie
                    dataKey="value"
                    data={participationData.pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                >
                    {participationData.pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                {/* Include Legend component with the payload */}
                <Legend payload={participationData.legendData} className=' lg:block' />
            </PieChart>
        </section>
    )
}
