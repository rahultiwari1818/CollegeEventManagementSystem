import React from 'react';
import GenerateEvent from "../pages/GenerateEvent";
import Login from '../pages/Login';
import {  Route, Routes } from 'react-router-dom';
import EventDetail from '../pages/EventDetail';
import Installation from '../pages/Installation';
import AddStudents from '../pages/AddStudents';
import ViewStudents from "../pages/ViewStudents";
import RegisterInEvent from '../components/RegisterInEvent';
import AddFaculties from '../pages/AddFaculties';
import ViewFaculties from '../pages/ViewFaculties';
import Profile from '../pages/Profile';
import Home from '../pages/Home';
import ErrorPage from '../pages/ErrorPage';
import Courses from '../pages/Courses';
import EventType from '../pages/EventType';
export default function Router() {
	return (
		<Routes>
			<Route exact path="/" element={<Installation />} />
			<Route path="/generateevent" element={<GenerateEvent />} />
			<Route path="/login" element={<Login />} />
			<Route path="/home" element={<Home />} />
			<Route path="/eventdetails/:id" element={<EventDetail />} />
			<Route path="/registerInEvent/:eid" element={<RegisterInEvent />} />
			<Route path="/registerInEvent/:eid/:sid" element={<RegisterInEvent />} />
			<Route path="/addstudents" element={<AddStudents />} />
			<Route path="/viewstudents" element={<ViewStudents />} />
			<Route path="/addfaculties" element={<AddFaculties/>} />
			<Route path='/viewfaculties' element={<ViewFaculties/>} />
			<Route path='/profile' element={<Profile/>} />
			<Route path='/courses' element={<Courses/>} />
			<Route path='/eventType' element={<EventType/>} />
			<Route path="*" element={<ErrorPage/>}/>
		</Routes>
	)
}

