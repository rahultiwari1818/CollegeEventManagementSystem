import React, { useEffect, useRef, useState } from 'react'
import Modal from './Modal';
import Dropdown from './Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as CalanderIcon } from "../assets/Icons/calander_icon.svg";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function UpdateEvent({ openUpdateModal, setOpenUpdateModal, dataToUpdate, setDataUpdated }) {

    const [data, setData] = useState(dataToUpdate);
    const noOfPartcipants = useRef(null);
    const token = localStorage.getItem("token");

    const { id } = useParams();

    const API_URL = process.env.REACT_APP_BASE_URL;

    const updateEvent = async (e) => {
        e.preventDefault();
        const dataObject = {
            ename: data.ename.trim(),
            etype: data.etype.trim(),
            ptype: data.ptype.trim(),
            noOfParticipants: data.noOfParticipants,
            edate: formatDate(data.edate),
            edetails: encodeURIComponent( data.edetails.trim()),
            rules: encodeURIComponent( data.rules.trim()),
            rcdate: formatDate(data.rcdate),
        };

        try {
            const { data } = await axios.patch(`${API_URL}/api/events/updateEventDetails/${id}`, dataObject,
            {
                headers:{
                    "auth-token":token,
                }
            });
            if (data.result) {
                toast.success(data.message);
            }
        } catch (error) {

        }
        finally {
            setDataUpdated((old) => !old);
            setOpenUpdateModal(!openUpdateModal);
        }


    }


    const updateData = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData({ ...data, [name]: value });

    };

    const formatDate = (date) => {
        const isoDateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

        if (isoDateFormatRegex.test(date)) {
            // If already in the desired format, return the same date
            return date;
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };


    useEffect(() => {
        setData(dataToUpdate)
    }, [dataToUpdate])

    const eventTypes = [{ name: "Cultural" }, { name: "IT" }, { name: "Management" }, { name: "Sports" }];


    return (
        <Modal isOpen={openUpdateModal} close={setOpenUpdateModal} heading={"Update Event"}>
            <form method="post" className='p-4' onSubmit={updateEvent}>
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

                </section>

                <section className='md:flex md:justify-between md:items-center block'>

                    <section className='md:p-2 md:m-2  p-1 m-1'>
                        <label htmlFor="rcdate">Registration Closing  Date:</label><br />
                        <DatePicker
                            name='rcdate'
                            selected={new Date(data.rcdate)}
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
                            selected={new Date(data.edate)}
                            onChange={(date) => setData({ ...data, edate: date })}
                            dateFormat="dd-MM-yyyy"
                            minDate={new Date()}
                            className=" w-full shadow-lg md:p-3 rounded-lg md:m-2 p-2 m-1"
                            icon={<CalanderIcon />}
                            showIcon
                        />

                    </section>
                </section>


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
                    <input type="submit" value="Update Event" className='text-red-500 bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 ' />
                </section>
            </form>
        </Modal>
    )
}
