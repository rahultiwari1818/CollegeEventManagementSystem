import React from 'react';
import Modal from './Modal';
import PieChartComp from './PieChartComp';
import { ReactComponent as DownloadIcon } from "../assets/Icons/download_icon.svg"
export default function AnalyticsModal({ isOpen, close, data }) {


    return (
        <Modal isOpen={isOpen} close={close} heading={"View Analytics"}>
            <section className="relative w-full h-full border border-blue-500 py-5 px-3">
                <section className='absolute top-2 right-2 '>
                    <button className='py-2 px-2 md:py-3 md:px-3  border rounded-lg'>
                        <DownloadIcon className="h-5 w-5 " />
                    </button>
                </section>
                <section className={` my-4  md:flex items-center ${data?.eventData?.hasSubEvents ? "justify-between" : "justify-center"} `}>
                    <section>
                        <p className="text-xl my-2 text-blue-500 text-center">
                            Overall Participation Analytics
                        </p>
                        <PieChartComp data={data} courseWise={true} />
                    </section>
                    {
                        <section>
                            <p className="text-xl my-2 text-blue-500 text-wrap text-center">
                                Overall Participation Analytics
                            </p>
                            <PieChartComp data={data} courseWise={false} />
                        </section>
                    }
                </section>
            </section>
            <section className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                {
                    data?.eventData.hasSubEvents
                        ?
                        data?.eventData?.subEvents?.map((subEvent) => {
                            return <section key={subEvent.sId} className='relative border my-2 border-blue-500 py-3 px-3 flex items-center justify-center'>
                                <section className='relative'>
                                    <section className='absolute top-0 right-4 mx-3 '>
                                        <button className='py-2 px-2 md:py-3 md:px-3  border rounded-lg'>
                                            <DownloadIcon className="h-5 w-5 " />
                                        </button>
                                    </section>
                                    <section className="mt-12">
                                        <p className="text-xl my-2 text-blue-500 text-center">
                                            Participation Analytics of {subEvent.subEventName}
                                        </p>
                                        <PieChartComp data={data} sId={subEvent.sId} courseWise={true} />
                                    </section>
                                </section>
                            </section>
                        })
                        :

                        <>
                        </>
                }
            </section>
        </Modal>
    );
}
