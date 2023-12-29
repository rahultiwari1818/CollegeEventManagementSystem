import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatMongoDate } from '../utils';
import { toast } from 'react-toastify';
import Modal from './Modal';
import Dropdown from './Dropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReactComponent as CalanderIcon } from "../assets/Icons/calander_icon.svg";
export default function EventDetails() {

    const { id } = useParams();

    const API_URL = process.env.REACT_APP_BASE_URL;

    const [data, setData] = useState({});
    const [dataUpdated, setDataUpdated] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openCancelCnfModal, setOpenCancelCnfModal] = useState(false);




    const updateData = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData({ ...data, [name]: value });

    }


    const noOfPartcipants = useRef(null);

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
        if (data.etype === "Intra-College") {
            setData({ ...data, maxNoOfPartcipantsPerCollege: null })
        }
    }, [data]);




    const getEventDetails = () => {
        axios.get(`${API_URL}/api/events/getSpecificEvent/${id}`)
            .then((response) => {
                // console.log(response.data.data[0]);
                setData(response.data.data[0]);
            })
            .catch((err) => {

            })
    }


    const updateEvent = async (e) => {
        e.preventDefault();
        const dataObject = {
            ename: data.ename.trim(),
            etype: data.etype.trim(),
            ptype: data.ptype.trim(),
            noOfParticipants: data.noOfParticipants,
            edate: formatDate(data.edate),
            edetails: data.edetails.trim(),
            rules: data.rules.trim(),
            rcdate: formatDate(data.rcdate),
            maxNoOfTeamsPerCollege: data.maxNoOfTeamsPerCollege || 1,
            efees: data.efees
        };


        const response = await axios.patch(`${API_URL}/api/events/updateEventDetails/${id}`, dataObject);
        const responseData = response.data;
        if (responseData.result) {
            toast.success(response.message);
        }
        setOpenUpdateModal(!openUpdateModal);
    }

    const viewBrochure = () => {
        window.open(`${API_URL}/${data.ebrochurePath}`, "_blank")
    }

    const redirectToRegister = () => {

    }

    const changeEventStatus = (status) => {


        const dataToUpdate = (status === "cancel") ?
            {
                isCanceled: true
            }
            :
            {
                isCanceled: false
            };
        axios.patch(`${API_URL}/api/events/changeEventStatus/${id}`,
            dataToUpdate
        )
            .then((res) => {
                toast.success(res.data.message);
                setDataUpdated(!dataUpdated);
            })
            .catch((res) => {

            })
        if (!openCancelCnfModal) {
            setOpenCancelCnfModal(!openCancelCnfModal)
        }

    }





    console.log(data)

    const curDate = new Date();


    useEffect(() => {
        getEventDetails();
    }, [dataUpdated])


    return (
        <>
            <section className='m-5'>
                <section className='flex justify-center items-center '>

                    <section className='shadow-xl overflow-auto rounded-xl w-[90vw] md:w-[70vw] lg:w-[50vw] px-5 py-5'>
                        <section className="py-4">

                            <p className='text-3xl font-extrabold'>{data.ename}</p>
                        </section>
                        <section className='py-4'>

                            {
                                curDate > new Date(data.edate)
                                    ?
                                    <p className='text-red-500'>Event Expired</p>
                                    :
                                    curDate <= new Date(data.rcdate)
                                        ?
                                        <p className='text-green-500'>Registration Open</p>
                                        :
                                        <p className='text-red-500'>Registration Closed</p>
                            }
                        </section>
                        <section className="my-2 ">
                            <p className="text-xl">Event Type : {data.etype}</p>
                        </section>
                        <section className="my-2 ">
                            <p className="text-xl">Event Date : {formatMongoDate(data.edate)}</p>
                        </section>
                        <section className="my-2 ">
                            <p className="text-xl text-red-500">Registration Closing Date : {formatMongoDate(data.rcdate)}</p>
                        </section>
                        <section className="my-2 ">
                            <table className="min-w-full bg-white border border-b border-blue-500">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b text-blue-500">Participation Type</th>
                                        {
                                            data.ptype === "Group" &&
                                            <th className="py-2 px-4 border-b text-blue-500">Max No of Allowed Participant Per Team</th>
                                        }
                                        {
                                            data.etype === "Inter-College" &&
                                            <>
                                                <th className="py-2 px-4 border-b text-blue-500">Max No of Teams Per College</th>
                                                <th className="py-2 px-4 border-b text-blue-500">Event Fees</th>
                                            </>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2 px-4 border-b">{data.ptype}</td>
                                        {
                                            data.ptype === "Group" &&
                                            <td className="py-2 px-4 border-b">{data.noOfParticipants}</td>
                                        }
                                        {
                                            data.etype === "Inter-College" &&
                                            <>
                                                <td className="py-2 px-4 border-b ">{data.maxNoOfTeamsPerCollege}</td>
                                                <td className="py-2 px-4 border-b ">{data.efees} Rs.</td>
                                            </>
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                        <section className="my-2 py-2">
                            <p className='text-xl'>Event Details:</p>
                            <p className="text-lg my-2 shadow-xl rounded-xl px-2 py-2">{data.edetails}</p>
                        </section>
                        <section className="my-2 py-2">
                            <p className='text-xl'>Event Rules:</p>
                            <p className="text-lg my-2 shadow-xl rounded-xl px-2 py-2">{data.rules}</p>
                        </section>
                        <section className="my-2 py-2">
                            <button
                                className='px-5 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500'
                                onClick={viewBrochure}
                            >
                                View Brochure
                            </button>
                        </section>


                        {/* Conditional Rendering  for Participants -- where user is not admin */}
                        {
                            (true && !data.isCanceled && curDate <= new Date(data.rcdate)) &&
                            <section className="my-2 py-2">
                                <button
                                    className='px-5 py-3 bg-blue-500 rounded-lg shadow-lg text-white hover:text-blue-500 hover:bg-white hover:outline hover:outline-blue-500'
                                    onClick={redirectToRegister}

                                >
                                    Register
                                </button>
                            </section>
                        }


                        {/* Conditional Rendering for Admins */}
                        {
                            true &&
                            <section className="my-2 py-2 block  md:flex justify-around  items-center">
                                {
                                    true &&
                                    <section className='my-2'>

                                        <button
                                            className=' px-5 py-3 bg-yellow-500 rounded-lg shadow-lg text-white hover:text-yellow-500 hover:bg-white hover:outline hover:outline-yellow-500'
                                            onClick={setOpenUpdateModal}>
                                            Update
                                        </button>
                                    </section>
                                }

                                <section className='my-2'>
                                    <button
                                        className='px-5 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500'
                                        // onClick={setOpenCancelCnfModal}
                                    >
                                        Declare Result
                                    </button>
                                </section>

                                {/* to cancel event */}
                                {(true && !data.isCanceled && curDate < data.edate) &&

                                    <section className='my-2'>
                                        <button
                                            className='px-5 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:text-red-500 hover:bg-white hover:outline hover:outline-red-500'
                                            onClick={setOpenCancelCnfModal}
                                        >
                                            Cancel  Event
                                        </button>
                                    </section>
                                }
                                {/* to activate event */}
                                {
                                    (true && data.isCanceled) &&


                                    <section className='my-2'>
                                        <button
                                            className='px-5 py-3 bg-green-500 rounded-lg shadow-lg text-white hover:text-green-500 hover:bg-white hover:outline hover:outline-green-500'
                                            onClick={() => { changeEventStatus("activate") }}
                                        >
                                            Activate  Event
                                        </button>
                                    </section>
                                }
                            </section>

                        }



                    </section>
                </section>
            </section>
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
                                people={[{ name: "Intra-College" }, { name: "Inter-College" }]}
                                selected={data.etype}
                                setSelected={setData}
                                name={"etype"}
                                label={"Select Event Type"}
                            />
                        </section>
                        <section className='md:p-2 md:m-2  p-1 m-1'>
                            <label htmlFor="ptype">Participation  Type:</label>
                            <Dropdown
                                people={[{ name: "Individual" }, { name: "Group" }]}
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
                                value={data.noOfPartcipants}
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
                        {

                            data.etype === "Inter-College" &&
                            <section className='md:p-2 md:m-2  p-1 m-1'>
                                <label htmlFor="mopc">Max No Of Participants/Teams per College:</label>
                                <input type="number"
                                    name="maxNoOfTeamsPerCollege"
                                    min={1}
                                    value={data.maxNoOfTeamsPerCollege}
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
                        }
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
                    {
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
                    }

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

            <Modal isOpen={openCancelCnfModal} close={setOpenCancelCnfModal} heading={"Cancel Event"}>
                <section className="py-3">
                    <section className='text-center text-red-500'>
                        Are You Sure to Cancel Event ?
                    </section>
                    <section className='md:flex justify-between items-center py-2 md:py-5'>
                        <button className='px-5 py-4 bg-white text-blue-500 outline outline-blue-500 hover:bg-blue-500 hover:text-white rounded-lg'
                            onClick={() => { setOpenCancelCnfModal(!openCancelCnfModal) }}
                        >No</button>
                        <button className='px-5 py-4 bg-white text-red-500 outline outline-red-500 hover:bg-red-500 hover:text-white rounded-lg'
                            onClick={() => { changeEventStatus("cancel") }}
                        >Yes</button>
                    </section>
                </section>

            </Modal>
        </>
    )
}
