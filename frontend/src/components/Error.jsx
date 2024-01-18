import React from 'react'
import './error.scss';

export default function Error() {
  return (
    <section className='pageNotFound '>
    <section className='container'>
        <section className="errorsectionision">
          <h1 className='mainHeading'>404-Error</h1>
          <h2 className='subHeading'>page not found</h2>
         
          <section className="backHome">
            <button className='homeBtn rounded-md bg-white text-black px-3 py-2'>Back To Home</button>
          </section>
        </section>
        <section className="imagesectionision">
          <section className="layer"></section>
          <section className="innerImage">
            {/* <img src={astronaut} alt="astronaut" /> */}
          </section>
        </section>
    </section>
</section>
  )
}
