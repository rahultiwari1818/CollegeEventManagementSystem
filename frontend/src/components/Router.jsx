import React from 'react';
import GenerateEvent from "./GenerateEvent";
import AllEvents from './AllEvents';
import Login from './Login';
import {  Route, Routes } from 'react-router-dom';
import EventDetails from './EventDetails';
import Installation from './Installation';
import Error from './Error';
export default function Router() {
	return (
		<Routes>
			<Route path="/installation" element={<Installation />} />
			<Route path="/generateevent" element={<GenerateEvent />} />
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<AllEvents />} />
			<Route path="/eventdetails/:id" element={<EventDetails />} />
			<Route path="*" element={<Error/>}/>
		</Routes>
	)
}

