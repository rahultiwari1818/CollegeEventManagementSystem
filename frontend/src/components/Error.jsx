import React from 'react'
import './error.scss';
import  Astronaut  from "../assets/images/astronaut.png";

export default function Error() {
  return (
    <section className='pageNotFound w-full h-full py-2  bg-black  md:py-32 '>
    <section className='container mx-auto grid grid-cols-1 gap-3 items-center content-center px-2 py-5 md:grid-cols-2 overflow-hidden'>
        <section className="errorsectionision flex flex-col items-center content-center py-10 px-2 order-1 md:order-2">
          <h1 className='mainHeading text-center text-6xl text-white'>404-Error</h1>
          <h2 className='subHeading text-white text-lg leading-5 px-1 py-0  font-semibold text-center uppercase'>page not found</h2>
         
          <section className="backHome">
            <button className='homeBtn rounded-md bg-white text-black px-3 py-2'>Back To Home</button>
          </section>
        </section>
        <section className="imagesectionision flex flex-col items-center content-center p-2 ">
          <section className="layer"></section>
          <section className="innerImage">
            <img src={Astronaut} alt="astronaut" />
          </section>
        </section>
    </section>
</section>
  )
}
