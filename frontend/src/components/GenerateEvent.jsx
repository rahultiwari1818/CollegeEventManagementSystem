import React, { useCallback, useEffect, useRef, useState } from 'react'
import Dropdown from './Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as CalanderIcon } from "../assets/Icons/calander_icon.svg";
import { ReactComponent as FileUploadIcon } from "../assets/Icons/FileUploadIcon.svg";
import { ReactComponent as AddIcon } from "../assets/Icons/add_icon.svg";
import { ReactComponent as EditIcon } from "../assets/Icons/edit_icon.svg";
import { ReactComponent as DeleteIcon } from "../assets/Icons/DeleteIcon.svg";
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatFileSize } from '../utils';
import ToggleSwitch from './ToggleSwitch';
import AddSubEvents from './AddSubEvents';

export default function GenerateEvent() {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const initialState = {
        ename: "",
        etype: "",
        ptype: "",
        enature: "",
        noOfParticipants: 1,
        edate: new Date(new Date().setDate(new Date().getDate() + 1)),
        rcdate: new Date(),
        rules: "",
        edetails: "",
        ebrochure: null,
        eposter: null,
        hasSubEvents: false,
        subEvents: []
    }

    const [data, setData] = useState(initialState);
    const [subEventDataToUpdate, setSubEventDataToUpdate] = useState({});
    const updateData = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData({ ...data, [name]: value });
    }
    const updateHasSubEvents = useCallback((value) => {
        setData(prevData => ({
            ...prevData,
            hasSubEvents: value
        }));
        console.log(data)
    }, []);

    const removeSubEvent = (id) => {
        const filteredSubEvents = data?.subEvents?.filter((event) => event.sId !== id);
        setData({
            ...data,
            subEvents: filteredSubEvents
        })
    }

    const updateAddSubEvent = (id) => {
        const subEventData = data?.subEvents?.filter((event) => event.sId === id);

        setSubEventDataToUpdate(() => subEventData[0]);
        setOpenAddSubEventModal((old) => !old)
    }


    const [openAddSubEventModal, setOpenAddSubEventModal] = useState(false);


    const noOfPartcipants = useRef(null);

    const generateEventHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("ename", data.ename.trim());
        formData.append("etype", data.etype.trim());
        formData.append("ptype", data.ptype.trim());
        formData.append("enature", data.enature.trim());
        formData.append("noOfParticipants", data.noOfParticipants);
        formData.append("edate", formatDate(data.edate));
        formData.append("rcdate", formatDate(data.rcdate));
        formData.append("edetails", (data.edetails.trim()));
        formData.append("rules", (data.rules.trim()));
        formData.append("ebrochure", data.ebrochure);
        formData.append("eposter", data.eposter);
        formData.append("hasSubEvents",data.hasSubEvents);
        formData.append("subEvents",JSON.stringify(data.subEvents));
        try {
            const { data } = await axios.post(`${API_URL}/api/events/generateevent`, formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    "auth-token": token,
                },
            });
            if (data.result) {
                toast.success(data.message);
                setData(initialState)
            }
        } catch (error) {
            console.error('Request failed:', error);
        }
        finally {

        }







    }

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };


    useEffect(() => {
        console.log(data);
    }, [data])



    const eventNatures = [{ name: "Cultural" }, { name: "IT" }, { name: "Management" }, { name: "Sports" }];
    const eventTypes = [{ name: "Intra-College" }, { name: "Inter-College" }];

    return (

<>
    <section className='flex justify-center items-center'>
        <section className='p-5 md:p-10 shadow-2xl bg-white md:outline-none outline outline-blue-500 md:mt-0 md:mb-0 mt-2 w-full max-w-4xl'>
            <p className='text-2xl text-center text-white bg-blue-500 p-2'>Generate Event</p>
            <form method="post" className='p-4' onSubmit={generateEventHandler}>
                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="ename">Event Name:</label>
                    <input
                        type="text"
                        name="ename"
                        value={data.ename}
                        onChange={updateData}
                        placeholder='Enter Event Name'
                        className='w-full shadow-lg md:p-3 rounded-lg p-2'
                        required
                    />
                </section>
                <section className='md:flex md:justify-start gap-10 md:items-center'>
                    <section className='md:p-2 md:m-2 p-1 m-1'>
                        <label htmlFor="etype">Event Nature:</label>
                        <Dropdown
                            dataArr={eventNatures}
                            selected={data.enature}
                            setSelected={setData}
                            name={"enature"}
                            label={"Select Event Nature"}
                        />
                    </section>

                    <section className='md:p-2 md:m-2 p-1 m-1'>
                        <label htmlFor="nop">Event Type:</label>
                        <Dropdown
                            dataArr={eventTypes}
                            selected={data.etype}
                            setSelected={setData}
                            name={"etype"}
                            label={"Select Event Type"}
                        />
                    </section>
                </section>

                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <ToggleSwitch headingText={"Has Sub Event?"} updateHasSubEvents={updateHasSubEvents} hasSubEvents={data.hasSubEvents} />
                </section>

                {data?.hasSubEvents && (
                    <section className='md:p-2 md:m-2 p-1 m-1'>
                        <p className='flex gap-5 items-center'>
                            Add Sub Events   <span className='rounded-lg  outline outline-blue-500'>
                                <AddIcon className='cursor-pointer' onClick={setOpenAddSubEventModal} />
                            </span>
                        </p>
                        <section className='max-w-full overflow-auto'>
                            <table className="w-full md:w-[90vh] lg:w-[90vh] border-collapse border border-blue-500 my-3 rounded-lg">
                                <thead className="">
                                    <tr>
                                        <th className="py-2 px-4 border border-blue-500">Sr No</th>
                                        <th className="py-2 px-4 border border-blue-500">Event Name</th>
                                        <th className="py-2 px-4 border border-blue-500">Participation Type</th>
                                        <th className="py-2 px-4 border border-blue-500">No Of Participants</th>
                                        <th className="py-2 px-4 border border-blue-500">Update</th>
                                        <th className="py-2 px-4 border border-blue-500">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.subEvents?.map((event, idx) => (
                                        <tr className="p-2" key={event?.sId}>
                                            <td className="py-2 px-4 border border-blue-500">{idx + 1}</td>
                                            <td className="py-2 px-4 border border-blue-500">{event.subEventName}</td>
                                            <td className="py-2 px-4 border border-blue-500">{event.ptype}</td>
                                            <td className="py-2 px-4 border border-blue-500">{event.noOfParticipants}</td>
                                            <td className="py-2 px-4 border border-blue-500">
                                                <EditIcon className="cursor-pointer" onClick={() => updateAddSubEvent(event.sId)} />
                                            </td>
                                            <td className="py-2 px-4 border border-blue-500">
                                                <DeleteIcon className="cursor-pointer" onClick={() => removeSubEvent(event.sId)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </section>
                )}

                {!data?.hasSubEvents && (
                    <section className='md:flex md:justify-start gap-10 md:items-center'>
                        <section className='md:p-2 md:m-2 p-1 m-1'>
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
                        <section className='md:p-2 md:m-2 p-1 m-1'>
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
                                className='block shadow-lg md:p-3 rounded-lg p-2'
                                required
                            />
                        </section>
                    </section>
                )}

                <section className='md:flex md:justify-start gap-10 md:items-center'>
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

                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="details">Event Details:</label><br />
                    <textarea
                        name="edetails"
                        value={data.edetails}
                        onChange={updateData}
                        className='w-full shadow-lg md:p-3 rounded-lg p-2'
                        placeholder="Enter Event Details "
                        required
                    ></textarea>
                </section>
                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <label htmlFor="rules">Rules For Events:</label><br />
                    <textarea
                        name="rules"
                        value={data.rules}
                        onChange={updateData}
                        className='w-full shadow-lg md:p-3 rounded-lg p-2'
                        placeholder="Enter Rules "
                        required
                    ></textarea>
                </section>

                {/* File upload sections */}

                <section className='md:p-2 md:m-2 p-1 m-1'>
                <section className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzoneFileForPoster"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileUploadIcon className="h-10 w-10" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to Upload</span> or Drag and Drop Event Poster
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">

                                        </p>
                                    </section>
                                    <section className="mt-2">
                                        {data.eposter ? (
                                            <>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Selected File: {data.eposter.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Selected File Size : {formatFileSize(data.eposter.size)}
                                                </p>
                                            </>
                                        ) : null}
                                    </section>
                                    <input
                                        type="file"
                                        id="dropzoneFileForPoster"
                                        name="eposter"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            // console.log("poster",file);
                                            setData({ ...data, eposter: file });
                                        }}

                                    />
                                </label>
                            </section>
                </section>

                <section className='md:p-2 md:m-2 p-1 m-1'>
                <section className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzoneFileForBrochure"
                                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <section className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileUploadIcon className="h-10 w-10" />
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
                                        id="dropzoneFileForBrochure"
                                        name="ebrochure"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            // console.log("brochure",file);
                                            setData({ ...data, ebrochure: file });
                                        }}

                                    />
                                </label>
                            </section>                </section>

                <section className='md:p-2 md:m-2 p-1 m-1'>
                    <input type="submit" value="Generate Event" className='text-red-500 bg-white rounded-lg shadow-lg px-5 py-3 w-full m-2 outline outline-red-500 hover:text-white hover:bg-red-500 ' />
                </section>
            </form>
        </section>
    </section>
    <AddSubEvents openUpdateModal={openAddSubEventModal} setOpenUpdateModal={setOpenAddSubEventModal} heading={"Add Sub Event"} setData={setData} dataToBeUpdated={subEventDataToUpdate} setSubEventDataToUpdate={setSubEventDataToUpdate} />
</>
    )
}

