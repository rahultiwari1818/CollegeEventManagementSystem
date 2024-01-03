import React, { useEffect, useRef, useState } from 'react'
import Dropdown from './Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as CalanderIcon } from "../assets/Icons/calander_icon.svg";
import axios from 'axios';
import { toast } from 'react-toastify';

export default function GenerateEvent() {

    const API_URL = process.env.REACT_APP_BASE_URL;

    const [data, setData] = useState({
        ename: "",
        etype: "",
        ptype: "",
        noOfParticipants: 1,
        edate: new Date(),
        rcdate: new Date().setDate(new Date().getDate() - 1),
        rules: "",
        edetails: "",
        ebrochure: null,
    });


    const updateData = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData({ ...data, [name]: value });

    }


    const noOfPartcipants = useRef(null);

    const generateEventHandler = async(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("ebrochure", data.ebrochure);
        formData.append("ename", data.ename.trim());
        formData.append("etype", data.etype.trim());
        formData.append("ptype", data.ptype.trim());
        formData.append("noOfParticipants", data.noOfParticipants);
        formData.append("edate", formatDate(data.edate));
        formData.append("edetails", data.edetails.trim());
        formData.append("rules", data.rules.trim());
        formData.append("rcdate", formatDate(data.rcdate));
        formData.append("maxNoOfTeamsPerCollege", data.maxNoOfTeamsPerCollege || 1);
        formData.append("efees", data.efees);

        try {
            const {data} = await axios.post(`${API_URL}/api/events/generateevent`, formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                },
            });
            // data = data.data;
            console.log(data)
            if (data.result) {
                toast.success(data.message);
                setData({
                    ename: "",
                    etype: "",
                    ptype: "",
                    noOfParticipants: 1,
                    edate: new Date(),
                    rcdate: new Date().setDate(new Date().getDate() + 1),
                    rules: "",
                    maxNoOfPartcipantsPerCollege: 1,
                    edetails: "",
                    ebrochure: null,
                    efees: ""
                })
            }
        } catch (error) {
            console.error('Request failed:', error);
        }



        




    }

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };



    // useEffect(()=>{
    //     if(data.etype==="Intra-College"){
    //         setData({...data,maxNoOfPartcipantsPerCollege:null})
    //     }
    // },[data]);


    const eventTypes = [{ name: "Cultural" }, { name: "IT" } ,{ name: "Management" } ];


    return (

        <section className='flex justify-center items-center '>
            <section className='p-5 md:p-10 shadow-2xl bg-white md:outline-none outline outline-blue-500 md:mt-0 md:mb-0 mt-2 mb-2 '>
                <p className='text-2xl text-center text-white bg-blue-500 p-2'>Generate Event</p>
                <form method="post" className='p-4' onSubmit={generateEventHandler}>
                    <section className='md:p-2 md:m-2 p-1 m-1' >
                        <label htmlFor="ename">Event Name:</label>
                        <input
                            type="text"
                            name="ename"
                            value={data.ename}
                            onChange={updateData}
                            placeholder='Enter Event Name'
                            className='w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                            required
                        />
                    </section>
                    <section className='md:flex md:justify-between md:items-center block '>
                        <section className='md:p-2 md:m-2  p-1 m-1'>
                            <label htmlFor="etype">Event Type:</label>
                            <Dropdown
                                dataArr={eventTypes}
                                selected={data.etype}
                                setSelected={setData}
                                name={"etype"}
                                label={"Select Event Type"}
                            />
                        </section>
                        <section className='md:p-2 md:m-2  p-1 m-1'>
                            <label htmlFor="ptype">Participation  Type:</label>
                            <Dropdown
                                dataArr={[{ name: "Individual" }, { name: "Group" }]}
                                selected={data.ptype}
                                setSelected={setData}
                                name={"ptype"}
                                label={"Select Participation Type"}
                                ref={noOfPartcipants}
                            />
                        </section>
                    </section>
                    <section className='md:flex md:justify-between md:items-center block '>
                        <section className='md:p-2 md:m-2  p-1 m-1'>
                            <label htmlFor="nop">Max No Of Team Members:</label>
                            <input type="number"
                                name="noOfParticipants"
                                min={1}
                                ref={noOfPartcipants}
                                value={data.noOfParticipants}
                                onChange={updateData}
                                onBlur={(e) => {
                                    if (e.target.name === "noOfPartcipants") {
                                        if (e.target.value < 1) {
                                            setData({ ...data, [e.target.name]: 1 });
                                            return;
                                        }
                                    }
                                }}
                                placeholder='Enter No Of Participants'
                                className='block shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                                required
                            />
                        </section>
                        {/* {
                            data.etype === "Inter-College" &&
                            <section className='md:p-2 md:m-2  p-1 m-1'>
                                <label htmlFor="mopc">Max No Of Participants/Teams per College:</label>
                                <input type="number"
                                    name="maxNoOfPartcipantsPerCollege"
                                    min={1}
                                    value={data.maxNoOfPartcipantsPerCollege}
                                    onChange={updateData}
                                    onBlur={(e) => {
                                        if (e.target.name === "noOfPartcipants") {
                                            if (e.target.value < 1) {
                                                setData({ ...data, [e.target.name]: 1 });
                                                return;
                                            }
                                        }
                                    }}
                                    placeholder='Max No Of Participants/Teams per College'
                                    className='block shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                                    required
                                />
                            </section>
                        } */}
                    </section>

                    <section className='md:flex md:justify-between md:items-center block'>

                        <section className='md:p-2 md:m-2  p-1 m-1'>
                            <label htmlFor="rcdate">Registration Closing  Date:</label><br />
                            <DatePicker
                                name='rcdate'
                                selected={data.rcdate}
                                onChange={(date) => setData({ ...data, rcdate: date })}
                                dateFormat="dd-MM-yyyy"
                                minDate={new Date().setDate(new Date().getDate() - 1)}
                                className="w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1"
                                showIcon
                                icon={<CalanderIcon />}
                            />
                        </section>
                        <section className='md:p-2 md:m-2  p-1 m-1'>
                            <label htmlFor="edate">Event Date:</label><br />
                            <DatePicker
                                name='edate'
                                selected={data.edate}
                                onChange={(date) => setData({ ...data, edate: date })}
                                dateFormat="dd-MM-yyyy"
                                minDate={new Date()}
                                className=" w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1"
                                icon={<CalanderIcon />}
                                showIcon
                            />

                        </section>
                    </section>
                    {/* {
                        data.etype === "Inter-College" &&

                        <section className='md:p-2 md:m-2  p-1 m-1'>
                            <label htmlFor="efees">Event Fees:</label>
                            <input type="number"
                                name="efees"
                                className=' w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                                placeholder='Enter Event Fees Amount in Rs.'
                                value={data.efees}
                                onChange={updateData}
                                required
                            />
                        </section>
                    } */}

                    <section className='md:p-2 md:m-2  p-1 m-1'>
                        <label htmlFor="details">Event Details:</label><br />
                        <textarea
                            name="edetails"
                            value={data.edetails}
                            onChange={updateData}
                            className=' w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                            placeholder="Enter Event Details "
                            required
                        ></textarea>
                    </section>
                    <section className='md:p-2 md:m-2  p-1 m-1'>
                        <label htmlFor="rules">Rules For Events:</label><br />
                        <textarea
                            name="rules"
                            value={data.rules}
                            onChange={updateData}
                            className=' w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1'
                            placeholder="Enter Rules "
                            required
                        ></textarea>
                    </section>

                    <section className='md:p-2 md:m-2  p-1 m-1'>
                        <section className="flex items-center justify-center w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop event brochure
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">

                                    </p>
                                </section>
                                <section className="mt-2">
                                    {data.ebrochure ? (
                                        <>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Selected File: {data.ebrochure.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Selected File Size : {formatFileSize(data.ebrochure.size)}
                                            </p>
                                        </>
                                    ) : null}
                                </section>
                                <input
                                    type="file"
                                    id="dropzone-file"
                                    name="ebrochure"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setData({ ...data, ebrochure: file });
                                    }}

                                />
                            </label>
                        </section>

                    </section>

                    <section className='md:p-2 md:m-2  p-1 m-1'>
                        <input type="submit" value="Generate Event" className='text-red-500 bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 ' />
                    </section>
                </form>
            </section>
        </section>
        
    )
}
