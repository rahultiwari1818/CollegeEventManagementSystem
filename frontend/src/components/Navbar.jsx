import React from 'react'
import CollegeLogo from "../assets/images/CollegeLogo.png";
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className='flex lg:justify-around bg-blue-500 p-2 shadow-xl top-0 sticky z-10'>
        <img src={CollegeLogo} alt="logo"  className='w-28 h-28 md:h-32 md:w-32 lg:h-40 lg:w-48'/>
        <section>
            {/* <Link to="/home">Home</Link> */}
            {/* <Link to="/home">Home</Link> */}
        </section>
    </nav>
  )
}
