import React, { useState } from 'react'
import CollegeLogo from "../assets/images/CollegeLogo.png";
import { Link } from 'react-router-dom';
import { ReactComponent as HamburgerIcon } from "../assets/Icons/HamburgerIcon.svg";
import { ReactComponent as CloseIcon } from "../assets/Icons/CloseIcon.svg";
export default function Navbar() {

  const [openSideBar, setOpenSideBar] = useState(false);


  const closeSideBar = () =>{
	setOpenSideBar(()=>!openSideBar);
  }

  return (
    <nav className='bg-blue-500 p-2  top-0 sticky z-10'>
      <section className='lg:flex items-center  lg:justify-around '>
        <img src={CollegeLogo} alt="logo" className='w-20 h-20 md:h-24 md:w-24 lg:h-32 lg:w-32' />
        <section className='hidden lg:flex'>
          <Link to="/" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Home </Link>
          <Link to="generateevent" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Generate Event </Link>
          <Link to="login" className='py-3 px-4 bg-red-500  text-white shadow-lg rounded-lg mx-3' > Login </Link>
        </section>

      </section>

      <section className='lg:hidden'>
        {
          !openSideBar &&
          <button className='fixed z-10 top-10 right-10 bg-white p-2 rounded ' onClick={() => closeSideBar()}>
            <HamburgerIcon />
          </button>
        }
        {
          openSideBar &&
          <button className='fixed z-10 top-10 right-10 bg-white p-2 rounded ' onClick={() => closeSideBar()}>
            <CloseIcon />
          </button>
        }
        {
          openSideBar &&
          <section className='lg:hidden fixed h-screen bg-blue-500 right-0 top-0 w-2/3'>
              <section className='m-5 absolute bottom-10'>
			  		<Link to="/" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Home </Link>
					<Link to="generateevent" className=' block my-3 py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' onClick={() => closeSideBar()}> Generate Event </Link>
					<Link to="login" className='block my-3 py-3 px-4 bg-red-500  text-white shadow-lg rounded-lg mx-3' onClick={() => closeSideBar()} > Login </Link>
              </section>

          </section>
        }
      </section>




    </nav>
  )
}
