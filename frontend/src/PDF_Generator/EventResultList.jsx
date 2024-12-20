import React, { Fragment, useEffect, useState } from 'react'
import { Image, Text, View, Page, Document, StyleSheet } from '@react-pdf/renderer';
import CollegeBanner from "../assets/images/DefaultPDFBanner.jpeg"
import moment from "moment";

export default function EventResultList({ collegeData, eventData, resultData }) {

    const [filteredResultData, setFilteredData] = useState([]);

    const [courseWiseResultData, setCourseWiseResultData] = useState([]);

    useEffect(() => {
        if (!eventData) return;
        if (eventData?.hasSubEvents) {
            if (eventData?.courseWiseResultDeclaration) {
                let courseResults = {};
                for (let team of resultData) {
                    const course = team.studentData[0].course._id;
                    const courseName = team.studentData[0].course.courseName;
                    if (courseResults[course]) {
                        courseResults[course].result.push(team)
                    }
                    else {
                        courseResults[course] = {
                            course: courseName,
                            result: [team]
                        };
                    }
                }
                courseResults = Object.values(courseResults)
                const groupedData = [];
                courseResults.forEach((course) => {
                    const subEventWise = {};
                    course?.result.forEach((team) => {
                        const sId = team.sId;
                        if (subEventWise[sId]) {
                            subEventWise[sId].push(team);
                        }
                        else {
                            subEventWise[sId] = [team];
                        }
                    })

                    groupedData.push({
                        course: course.course,
                        result: Object.values(subEventWise),
                    })
                })
                setCourseWiseResultData(groupedData)
            }
            else {
                const groupedData = resultData.reduce((acc, current) => {
                    // Check if there's already an entry for the current sId
                    if (acc[current.sId]) {
                        // If yes, push the current element to the existing array
                        acc[current.sId].push(current);
                    } else {
                        // If no, create a new array with the current element
                        acc[current.sId] = [current];
                    }
                    return acc;
                }, {});

                setFilteredData(Object.values(groupedData));
            }

        }
        else {
            if (eventData?.courseWiseResultDeclaration) {

                const courseResults = {};
                for (let team of resultData) {
                    const course = team.studentData[0].course._id;
                    const courseName = team.studentData[0].course.courseName;
                    if (courseResults[course]) {
                        courseResults[course].result.push(team)
                    }
                    else {
                        courseResults[course] = {
                            course: courseName,
                            result: [team]
                        };
                    }
                }
                setCourseWiseResultData(Object.values(courseResults));
            }
            else {
                setFilteredData(resultData);
            }
        }

    }, [collegeData, eventData, resultData])

    const currentProtocol = window.location.protocol;

    // Update the image URL with the current protocol
    let updatedImageUrl = collegeData?.collegePdfBannerPath?.includes("https:") ? collegeData?.collegePdfBannerPath
        :
        collegeData?.collegePdfBannerPath?.replace('http:', currentProtocol);

    const styles = StyleSheet.create({
        pageContainer: {
            fontSize: 12,
            paddingTop: 40,
            paddingLeft: 40,
            paddingRight: 40,
            paddingBottom: 40,
            lineHeight: 1.5,
            flexDirection: 'column',
            // borderWidth :  "2px",
            // borderColor : "red",
            // borderStyle : "solid",
        },
        subTitleContainer: {
            flexDirection: 'row',
            marginTop: 10,
            border: "2px solid blue",
            padding: 5
        },
        // spaceBetween: {
        //     flexDirection: 'row',
        //     alignItems: 'center',
        //     justifyContent: 'space-between',
        //     color: "#3E3E3E",
        // },
        logo: {
            width: 600,
            flexDirection: "row",
            marginLeft: -40,
            marginRight: -40,
            marginTop: -40
        },
        // CollegeName:{
        //     fontSize: 17,
        //     textAlign: 'center',
        //     marginLeft:10,
        //     borderWidth : "2px",
        //     borderColor : "red",
        //     borderStyle : "solid",
        // },
        reportTitle: {
            fontSize: 14,
            width: "100%",
            textAlign: 'center',
            color: "#4f3f92",
            textDecoration:"underline"
        },
        subEventHeading: {
            fontSize: 12,
            textAlign: 'center',
            width: "100%",
            color: "#0a0b27",
            marginBottom: 5,
            marginTop: 10,
            textDecoration:"underline"
        },
        theader: {
            marginTop: 5,
            fontSize: 10,
            paddingTop: 4,
            flex: 1,
            height: 25,
            backgroundColor: "#f4f5f5",
            color: "#63509f",
            textAlign: 'center',
            paddingLeft: 1,
            paddingRight: 1,
            borderColor: '#63509f',
            borderRightWidth: 1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
        },
        theader2: {
            borderLeftWidth: 1,
            borderColor: "#63509f",
            borderStyle: 'solid',
        },
        tbody: {
            fontSize: 9,
            paddingTop: 5,
            flex: 1,
            textAlign: 'center',
            paddingLeft: 1,
            paddingRight: 1,
            borderColor: '#63509f',
            borderRightWidth: 1,
            borderBottomWidth: 1,
        },
        tbody2: {
            flex: 1,
            borderLeftWidth: 1,
            borderColor: "#63509f",
            borderStyle: 'solid',
        },
        srnoColumn: {
            width: "30%",
            maxWidth: 30,
        },
        nameColumn: {
            width: "140%",
            maxWidth: 160,
        },
        sidColumn: {
            width: "70%",
            maxWidth: 80,
        },
        phnoColumn: {
            width: "70%",
            maxWidth: 80,
        },
        courseColumn: {
            width: "70%",
            maxWidth: 80,
        },
        semesterColumn: {
            width: "30%",
            maxWidth: 30,
        },
        divisiomColumn: {
            width: "30%",
            maxWidth: 30,
        }
    });

    const CollegeHeader = ({ collegeData }) => (

        <View>
            <Image style={styles.logo}
                src={collegeData.collegePdfBannerPath === "." ? CollegeBanner : updatedImageUrl}
            />
            <View style={{ paddingRight: 20, paddingTop: 10, }}>
                <Text style={{ textAlign: "right", fontSize: 12, textDecoration: "underline" }}>
                    <Text style={{ paddingRight: 10, }}>
                        Date
                    </Text>
                    <Text> : </Text>
                    <Text>
                        {
                            moment(Date.now()).format("DD-MM-YYYY")
                        }
                    </Text>
                </Text>
            </View>
        </View>
    );


    const ResultListTitle = () => (
        <View style={styles.subTitleContainer}>
            <Text style={styles.reportTitle}>Results of {eventData?.ename}</Text>
        </View>
    );

    const TableHead = ({ subEvent }) => {
        return (
            <View style={{ flexDirection: 'column', marginTop: 10, }}>
                {
                    subEvent[0]?.subEventName
                    &&

                    <Text style={styles.subEventHeading}>Result  of {subEvent[0]?.subEventName}</Text>
                }
                <View style={{ flexDirection: 'row', width: "100%" }}>
                    <View style={[styles.theader, styles.srnoColumn, styles.theader2,]}>
                        <Text>Rank</Text>
                    </View>
                    <View style={[styles.theader, styles.sidColumn]}>
                        <Text>SID</Text>
                    </View>
                    <View style={[styles.theader, styles.nameColumn]}>
                        <Text>Name</Text>
                    </View>
                    <View style={[styles.theader, styles.courseColumn]}>
                        <Text>Course</Text>
                    </View>
                    <View style={[styles.theader, styles.semesterColumn]}>
                        <Text>Sem</Text>
                    </View>
                    <View style={[styles.theader, styles.divisiomColumn]}>
                        <Text>Div</Text>
                    </View>
                    <View style={[styles.theader, styles.phnoColumn]}>
                        <Text>Mobile No.</Text>
                    </View>
                </View>
            </View>
        );
    };

    const TableBody = ({ subEvent }) => {
        return (
            <View style={{ marginBottom: 10, }}>
                {subEvent?.map((studentTeam, teamIdx) => (
                    <Fragment key={teamIdx}>
                        {studentTeam.studentData?.map((team, idx) => (
                            <View key={idx} style={{ flexDirection: 'row', }}>

                                <View style={[styles.tbody, styles.tbody2, styles.srnoColumn]}>
                                    {
                                        idx === 0 &&
                                        <Text>{studentTeam.rank}</Text>
                                    }
                                </View>

                                <View style={[styles.tbody, styles.sidColumn]}>
                                    <Text>{team.sid}</Text>
                                </View>
                                <View style={[styles.tbody, styles.nameColumn]}>
                                    <Text>{team.studentName}</Text>
                                </View>
                                <View style={[styles.tbody, styles.courseColumn]}>
                                    <Text>{team.course.courseName}</Text>
                                </View>
                                <View style={[styles.tbody, styles.semesterColumn]}>
                                    <Text>{team.semester}</Text>
                                </View>
                                <View style={[styles.tbody, styles.divisiomColumn]}>
                                    <Text>{team.division}</Text>
                                </View>
                                <View style={[styles.tbody, styles.phnoColumn]}>
                                    <Text>{team.phno}</Text>
                                </View>
                            </View>
                        ))}
                    </Fragment>
                ))}
            </View>
        );
    };


    return (
        <Document>
            <Page size="A4" style={[styles.pageContainer]}>
                <CollegeHeader collegeData={collegeData} />
                <View style={{}}>

                    <ResultListTitle />
                    {eventData.hasSubEvents
                        ?
                        eventData?.courseWiseResultDeclaration
                            ?
                            (
                                courseWiseResultData.map((course, courseIdx) => {
                                    return (
                                        <View style={{border:"2px solid blue",paddingHorizontal:"10px"}}>
                                            <Text style={[styles.subEventHeading,{borderBottom:"1px solid blue"}]}>Results  of {course.course}</Text>
                                            {
                                                course.result.map((subEvent, index) => (
                                                    subEvent.length > 0 && (
                                                        <View key={index} >
                                                            <TableHead subEvent={subEvent} />
                                                            <TableBody subEvent={subEvent} />
                                                        </View>
                                                    )
                                                ))
                                            }
                                        </View>
                                    )
                                })
                            )
                            :

                            (
                                filteredResultData.map((subEvent, index) => (
                                    subEvent.length > 0 && (
                                        <View key={index} >
                                            <TableHead subEvent={subEvent} />
                                            <TableBody subEvent={subEvent} />
                                        </View>
                                    )
                                ))
                            )
                        :

                        eventData?.courseWiseResultDeclaration
                            ?
                            (
                                courseWiseResultData.map((course) => {
                                    return (
                                        <View style={{border:"2px solid blue",paddingHorizontal:"10px"}}>
                                            <Text style={[styles.subEventHeading,{borderBottom:"1px solid blue"}]}>Results  of {course.course}</Text>
                                            <TableHead subEvent={course.result} />
                                            <TableBody subEvent={course.result} />
                                        </View>
                                    )
                                })
                            )
                            :
                            (
                                <>
                                    <TableHead subEvent={filteredResultData} />
                                    <TableBody subEvent={filteredResultData} />
                                </>
                            )

                    }
                </View>
            </Page>
        </Document>
    )
}
