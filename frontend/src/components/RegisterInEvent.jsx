import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Overlay from './Overlay';

export default function RegisterInEvent({ }) {


	const token = localStorage.getItem("token");
	const API_URL = process.env.REACT_APP_BASE_URL;

	const [registerData, setRegisterData] = useState({});
	const [eventData, setEventData] = useState({});
	const [isPageLoading, setIsPageLoading] = useState(true);

	const params = useParams();
	const eventId = params.eid;
	const subEventId = params.sid;
	console.log(subEventId, "params");
	// console.log(params)


	const onSubmitHandler = (e)=>{
		e.prevetDefault();
	}



	useEffect(() => {
		const fetchEventData = async () => {
			try {
				const { data } = await axios.get(`${API_URL}/api/events/getSpecificEvent/${eventId}`, {
					headers: {
						"auth-token": token,
					}
				});
				if (data?.data[0]?.hasSubEvents) {
					let subEventData = data?.data[0]?.subEvents?.filter((event) => event.sId === subEventId);
					subEventData = subEventData[0];
					setEventData(()=>{return {_id:data.data._id,subEventData}})
				}
				else {
					setEventData(data?.data[0]);
				}

			} catch (error) {

			}
		}
		fetchEventData();
	}, [params])




	useEffect(() => {
		setIsPageLoading((old) => false);
	}, [])



	const renderSidInputs = () => {
		const sidInputs = [];
		for (let i = 0; i < eventData?.noOfParticipants; i++) {
		  sidInputs.push(
			<section key={i} className='md:p-2 md:m-2 p-1 m-1'>
			  <label htmlFor={`sid-${i}`}>SID {i + 1}:</label>
			  <input type="text" id={`sid-${i}`} name={`sid-${i}`}  />
			</section>
		  );
		}
		return sidInputs;
	  };



	return (
		<>
			{
				isPageLoading &&
				<Overlay/>

			}

			<section>
				<form  method="post" onSubmit={onSubmitHandler}>
					{
						renderSidInputs()
					}
				</form>
			</section>
		</>

	)
}
