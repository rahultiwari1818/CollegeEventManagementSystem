import React, { useState } from 'react'
import CollegeLogo from "../assets/images/CollegeLogo.png";
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as HamburgerIcon } from "../assets/Icons/HamburgerIcon.svg";
import { ReactComponent as CloseIcon } from "../assets/Icons/CloseIcon.svg";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/UserSlice';
export default function Navbar() {

  const [openSideBar, setOpenSideBar] = useState(false);
  const {pathname} = useLocation();
  const isLoggedIn = useSelector((state)=>state.UserSlice.isLoggedIn);
  const dispatch = useDispatch();

  const closeSideBar = () =>{
	setOpenSideBar(()=>!openSideBar);
  }

  const logoutHandler = () =>{
    dispatch(logoutUser());
    localStorage.removeItem("token");
  }

  console.log(isLoggedIn,"is logged in")

  
  return (
    
    
    
    <nav className='bg-blue-500 p-2  top-0 sticky z-10'>
      <section className='lg:flex items-center  lg:justify-around '>
        <img src={CollegeLogo} alt="logo" className='w-20 h-20 md:h-24 md:w-24 lg:h-32 lg:w-32' />
        <section className='hidden lg:flex'>
          {
            pathname !== "/"
            &&
            <>
         
          {
            isLoggedIn ?
            <>
             <Link to="/home" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Home </Link>
          <Link to="generateevent" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' > Generate Event </Link>
          <Link to="login" className='py-3 px-4 bg-red-500  text-white shadow-lg rounded-lg mx-3' onClick={logoutHandler} > Logout </Link>
            </>
            :
            <Link to="login" className='py-3 px-4 bg-red-500  text-white shadow-lg rounded-lg mx-3' > Login </Link>
          }
          
          </>
          }
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
            {
              pathname !== "/"
              && 
              <section className='m-5 absolute bottom-[10vh]'>
			  		
          {
            isLoggedIn ?
            <>
          <Link to="/home" className='py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3'onClick={() => closeSideBar()} > Home </Link>
					<Link to="generateevent" className=' block my-3 py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3' onClick={() => closeSideBar()}> Generate Event </Link>
          <Link to="login" className='py-3 px-4 bg-red-500  text-white shadow-lg rounded-lg mx-3' onClick={()=>{logoutHandler();
           closeSideBar();
          }} > Logout </Link>
          </>
            :
					<Link to="login" className='block my-3 py-3 px-4 bg-red-500  text-white shadow-lg rounded-lg mx-3' onClick={() => closeSideBar()} > Login </Link>
          

          }

              </section>
            }

          </section>
        }
      </section>




    </nav>
  )
}
