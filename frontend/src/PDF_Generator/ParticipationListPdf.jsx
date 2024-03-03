import React, { Fragment } from 'react'
import { Image, Text, View, Page, Document, StyleSheet } from '@react-pdf/renderer';
import CollegeLogo from "../assets/images/CollegeLogo.png"

export default function ParticipationListPdf({ eventData, registrationData,collegeData }) {
    const styles = StyleSheet.create({
        page: {
            fontSize: 12,
            paddingTop: 30,
            paddingLeft: 40,
            paddingRight: 40,
            paddingBottom: 30,
            lineHeight: 1.5,
            flexDirection: 'column',
        },
        titleContainer: {
            flexDirection: 'row',
            marginTop: 10,
        },
        subTitleContainer:{
            flexDirection: 'row',
            marginTop: 15,
        },
        spaceBetween: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: "#3E3E3E",
        },
        logo: {
            width: 70,
        },
        CollegeName:{
            fontSize: 17,
            textAlign: 'center',
            marginLeft:10,
        },
        reportTitle: {
            fontSize: 14,
            textAlign: 'center',
            marginLeft:80,
        },
        subEventHeading:{
            fontSize: 12,
            textAlign: 'center',
            marginLeft:30,
        },
        theader: {
            marginTop: 5,
            fontSize: 10,
            fontStyle: 'bold',
            paddingTop: 4,
            paddingLeft: 4,
            flex: 1,
            height: 20,
            backgroundColor: '#DEDEDE',
            borderColor: 'whitesmoke',
            borderRightWidth: 1,
            borderBottomWidth: 1,
        },
        theader2: {
            flex: 1,
            borderRightWidth: 0,
            borderBottomWidth: 1,
        },
        tbody: {
            fontSize: 9,
            paddingTop: 4,
            paddingLeft: 7,
            flex: 1,
            borderColor: 'whitesmoke',
            borderRightWidth: 1,
            borderBottomWidth: 1,
        },
        tbody2: {
            flex: 1,
            borderRightWidth: 1,
        },
        srnoColumn: {
            width: "30%",
            maxWidth:30,
        },
        nameColumn:{
            width:"140%",
            maxWidth:160,
        },
        sidColumn:{
            width:"70%",
            maxWidth:80,
        },
        phnoColumn:{
            width:"70%",
            maxWidth:80,
        },
        courseColumn:{
            width:"70%",
            maxWidth:80,
        },
        semesterColumn:{
            width:"30%",
            maxWidth:30,
        },
        divisiomColumn:{
            width:"30%",
            maxWidth:30,
        }
    });

    const CollegeHeader = ({collegeData}) => (
        <View style={styles.titleContainer}>
            <View style={styles.spaceBetween}>
                <Image style={styles.logo} src={CollegeLogo} />
                <Text style={styles.CollegeName}>
                    {
                        collegeData?.collegename
                    }
                </Text>
            </View>
        </View>
    );

    const ParticiPationListTitle = () => (
        <View style={styles.subTitleContainer}>
                    <Text style={styles.reportTitle}>Participation List of {eventData?.ename}</Text>
        </View>
    );

    const TableHead = ({ subEvent }) => {
        return (
            <View style={{ flexDirection: 'column', marginTop: 10 }}>
                {
                    subEvent[0]?.subEventName
                    &&

                <Text style={[styles.subEventHeading, { textAlign: 'center', marginBottom: 5 }]}>Registration  of {subEvent[0]?.subEventName}</Text>
                }
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.theader, styles.srnoColumn, styles.theader2]}>
                        <Text>Sr No</Text>
                    </View>
                    <View style={[styles.theader,styles.sidColumn]}>
                        <Text>SID</Text>
                    </View>
                    <View style={[styles.theader,styles.nameColumn]}>
                        <Text>Name</Text>
                    </View>
                    <View style={[styles.theader,styles.courseColumn]}>
                        <Text>Course</Text>
                    </View>
                    <View style={[styles.theader,styles.semesterColumn]}>
                        <Text>Sem</Text>
                    </View>
                    <View style={[styles.theader,styles.divisiomColumn]}>
                        <Text>Div</Text>
                    </View>
                    <View style={[styles.theader,styles.phnoColumn]}>
                        <Text>Mobile No.</Text>
                    </View>
                </View>
            </View>
        );
    };

    const TableBody = ({ subEvent }) => {
        return (
            <View>
                {subEvent?.map((studentTeam, teamIdx) => (
                    <Fragment key={teamIdx}>
                        {studentTeam.studentData?.map((team, idx) => (
                            <View key={idx} style={{ flexDirection: 'row' }}>

                                <View style={[styles.tbody, styles.tbody2,styles.srnoColumn]}>
                                 {
                                 idx==0 &&   
                                 <Text>{ teamIdx + 1}</Text>
                                 }   
                                </View>

                                <View style={[styles.tbody,styles.sidColumn]}>
                                    <Text>{team.sid}</Text>
                                </View>
                                <View style={[styles.tbody,styles.nameColumn]}>
                                    <Text>{ team.studentName}</Text>
                                </View>
                                <View style={[styles.tbody,styles.courseColumn]}>
                                    <Text>{team.course.courseName}</Text>
                                </View>
                                <View style={[styles.tbody,styles.semesterColumn]}>
                                    <Text>{team.semester}</Text>
                                </View>
                                <View style={[styles.tbody,styles.divisiomColumn]}>
                                    <Text>{team.division}</Text>
                                </View>
                                <View style={[styles.tbody,styles.phnoColumn]}>
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
            <Page size="A4" style={styles.page}>
                <CollegeHeader collegeData={collegeData}/>
                <ParticiPationListTitle />
                {eventData.hasSubEvents ?
                 (
                    registrationData.map((subEvent, index) => (
                        subEvent.length > 0 && (
                            <View key={index}>
                                <TableHead subEvent={subEvent} />
                                <TableBody subEvent={subEvent} />
                            </View>
                        )
                    ))
                ) : (
                    <>
                        <TableHead subEvent={registrationData} />
                        <TableBody subEvent={registrationData} />
                    </>
                )}
            </Page>
        </Document>
    )
}
