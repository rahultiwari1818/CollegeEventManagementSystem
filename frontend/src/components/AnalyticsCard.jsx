import React, { useState } from 'react'
import AnalyticsModal from './AnalyticsModal';
import { PDFDownloadLink } from '@react-pdf/renderer';
import EventResultList from '../PDF_Generator/EventResultList';
import { useSelector } from 'react-redux';


export default function AnalyticsCard({ data }) {

    const [isOpenViewAnalyticsModal, setIsOpenViewAnalyticsModal] = useState(false);
    const collegeData = useSelector((state) => state.CollegeSlice.data);

    console.log(collegeData,"cd")

    const openViewAnalyticsModal = () => {
        setIsOpenViewAnalyticsModal(true);
    }

    const closeViewAnalyticsModal = () => {
        setIsOpenViewAnalyticsModal(false);
    }

    return (
        <>
            <section className='shadow-lg px-2 md:px-5 pt-5 pb-3 bg-white relative text-blue-500 h-[30vh] rounded-lg '>
                <img src={data.eventData.enature.eventTypeLogoPath} alt="event type" className='absolute opacity-40 left-0 right-0 top-0 bottom-0 w-full h-[30vh] rounded-lg' />
                <section className='relative'>

                    <section className="h-[15vh]">
                        <p className={`self-start text-base font-bold  text-nowrap w-full h-full`}>
                            {
                                data.eventData.ename
                            }
                        </p>
                        <p className={`self-start text-base font-bold  text-nowrap w-full h-full`}>
                            Total Participation :
                            {
                                data.approvedParticipation.length
                            }
                        </p>

                    </section>

                    <section className='h-[15vh]'>
                        <section className="flex justify-between w-full h-full items-center">
                            {/* <p className='text-base mb-1 ml-1 flex items-center'>
                        </p> */}
                            <PDFDownloadLink document={<EventResultList eventData={data.eventData} resultData={data.results} collegeData={collegeData} />} fileName={`${data.eventData?.ename}ResultList.pdf`} className='w-full my-2'>
                                <button
                                    className={` ${data.results.length === 0 ? "cursor-not-allowed" : ""}  text-nowrap px-5 py-3 bg-yellow-500 hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500 rounded text-white `}
                                    // onClick={openViewAnalyticsModal}
                                    disabled={data.results.length === 0}
                                >
                                    Download Results
                                </button>
                            </PDFDownloadLink>
                            <button
                                className={`  text-nowrap px-5 py-3 bg-green-500 hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500 rounded text-white `}
                                onClick={openViewAnalyticsModal}
                            >
                                View Details
                            </button>
                        </section>
                    </section>
                </section>
            </section>
            <AnalyticsModal isOpen={isOpenViewAnalyticsModal} close={closeViewAnalyticsModal} data={data} />
        </>
    )
}
