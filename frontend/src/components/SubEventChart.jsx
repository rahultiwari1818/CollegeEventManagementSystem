import React, { useRef } from 'react';
import { ReactComponent as DownloadIcon } from "../assets/Icons/download_icon.svg";
import html2canvas from "html2canvas";
import PieChartComp from './PieChartComp';


export default function SubEventChart({data,subEvent}) {


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
        <section className='relative border my-2 border-blue-500 py-3 px-3 flex items-center justify-center'>
            <section className='relative'>
                <section className='absolute top-0 right-4 mx-3 '>
                    <button className='py-2 px-2 md:py-3 md:px-3  border rounded-lg'
                    onClick={handleDownload}
                    >
                        <DownloadIcon className="h-5 w-5 " />
                    </button>
                </section>
                <section className="mt-12" ref={chartRef}>
                    <p className="text-xl my-2 text-blue-500 text-center">
                        Participation Analytics of {subEvent.subEventName}
                    </p>
                    <PieChartComp data={data} sId={subEvent.sId} courseWise={true} />
                </section>
            </section>
        </section>
    )
}
