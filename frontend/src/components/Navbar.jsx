import React, { useState } from 'react'
import CollegeLogo from "../assets/images/CollegeLogo.png";
import { Link } from 'react-router-dom';
import { ReactComponent as HamburgerIcon } from "../assets/Icons/HamburgerIcon.svg";
import { ReactComponent as CloseIcon } from "../assets/Icons/CloseIcon.svg";
export default function Navbar() {

  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <nav className='bg-blue-500 p-2  top-0 sticky z-10'>
      <section className='lg:flex items-center  lg:justify-around '>
        <img src={CollegeLogo} alt="logo" className='w-20 h-20 md:h-24 md:w-24 lg:h-32 lg:w-32' />
        <section className=''>
          <Link to="login" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Login </Link>
          <Link to="generateevent" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Generate Event </Link>
        </section>
        <section>

        </section>
      </section>

      {
        !openSideBar &&
        <button className='absolute top-10 right-10 bg-white p-2 rounded ' onClick={()=>setOpenSideBar(()=>!openSideBar)}>
          <HamburgerIcon />
        </button>
      }
      {
        openSideBar &&
        <button className='absolute top-10 right-10 bg-white p-2 rounded ' onClick={()=>setOpenSideBar(()=>!openSideBar)}>
          <CloseIcon />
        </button>
      }

    </nav>
  )
}
