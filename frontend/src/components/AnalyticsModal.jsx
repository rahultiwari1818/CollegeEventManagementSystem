import React, { useRef } from 'react';
import Modal from './Modal';
import PieChartComp from './PieChartComp';
import { ReactComponent as DownloadIcon } from "../assets/Icons/download_icon.svg";
import html2canvas from "html2canvas";
import SubEventChart from './SubEventChart';

export default function AnalyticsModal({ isOpen, close, data }) {

    const chartRef = useRef(null);

    const handleDownload = () => {
        html2canvas(chartRef.current).then((canvas) => {
            const url = canvas.toDataURL();
            const link = document.createElement('a');
            link.href = url;
            link.download = 'reportChart.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <Modal isOpen={isOpen} close={close} heading={"View Analytics"}>
            <section className="relative w-full h-full border border-blue-500 py-5 px-3">
                <section className='absolute top-2 right-2 '>
                    <button className='py-2 px-2 md:py-3 md:px-3  border rounded-lg'
                        onClick={handleDownload}
                    >
                        <DownloadIcon className="h-5 w-5 " />
                    </button>
                </section>
                <section className={` my-4 py-3  md:flex items-center ${data?.eventData?.hasSubEvents ? "justify-between" : "justify-center"} `} ref={chartRef}>
                    <section>
                        <p className="text-xl my-2 text-blue-500 text-center">
                            Overall Participation Analytics
                        </p>
                        <PieChartComp data={data} courseWise={true} />
                    </section>
                    {
                        data?.eventData.hasSubEvents &&
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
                            return <SubEventChart data={data} subEvent={subEvent} key={subEvent.sId} />
                        })
                        :

                        <>
                        </>
                }
            </section>
        </Modal>
    );
}
