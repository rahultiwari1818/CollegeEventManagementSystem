import React from 'react';
import GenerateEvent from "./GenerateEvent";
import AllEvents from './AllEvents';
import Login from './Login';
import {  Route, Routes } from 'react-router-dom';
import EventDetails from './EventDetails';
import Installation from './Installation';
import Error from './Error';
import AddStudents from './AddStudents';
import ViewStudents from "./ViewStudents";
import RegisterInEvent from './RegisterInEvent';
import AddFaculties from './AddFaculties';
import ViewFaculties from './ViewFaculties';
export default function Router() {
	return (
		<Routes>
			<Route exact path="/" element={<Installation />} />
			<Route path="/generateevent" element={<GenerateEvent />} />
			<Route path="/login" element={<Login />} />
			<Route path="/home" element={<AllEvents />} />
			<Route path="/eventdetails/:id" element={<EventDetails />} />
			<Route path="/registerInEvent/:eid" element={<RegisterInEvent />} />
			<Route path="/registerInEvent/:eid/:sid" element={<RegisterInEvent />} />
			<Route path="/addstudents" element={<AddStudents />} />
			<Route path="/viewstudents" element={<ViewStudents />} />
			<Route path="/addfaculties" element={<AddFaculties/>} />
			<Route path='/viewfaculties' element={<ViewFaculties/>} />
			<Route path="*" element={<Error/>}/>
		</Routes>
	)
}

