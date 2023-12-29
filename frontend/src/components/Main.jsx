import React from 'react'
import GenerateEvent from "./GenerateEvent";
import AllEvents from './AllEvents';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EventDetails from './EventDetails';
export default function Main() {
  return (
    <main className='max-h-[75vh] lg:max-h-[70vh] overflow-auto'>
            <BrowserRouter>
				<Routes>
					<Route path="/generateevent" element={<GenerateEvent/>}/>
					<Route path="/" element={<AllEvents/>}/>
					<Route path="/eventdetails/:id" element={<EventDetails/>}/>
				</Routes>
            </BrowserRouter>
    </main>
  )
}
