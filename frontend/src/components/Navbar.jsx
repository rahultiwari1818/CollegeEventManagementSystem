import React from 'react'
import CollegeLogo from "../assets/images/CollegeLogo.png";
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className='flex lg:justify-around bg-blue-500 p-2 shadow-xl top-0 sticky z-10'>
      <img src={CollegeLogo} alt="logo" className='w-20 h-20 md:h-24 md:w-24 lg:h-32 lg:w-32' />
      <section>
        <Link to="login" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Login </Link>
        <Link to="generateevent" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Generate Event </Link>
      </section>
    </nav>
  )
}
