import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as UpIcon } from '../assets/Icons/BlueUpArrow.svg';



export default function Example({options,label,closeSideBar}) {

    const handleCloseSideBar = () =>{
        if(closeSideBar){
            closeSideBar();
        }
    }

  return (
    <section className=" my-3 mx-3  ">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? 'text-blue-500' : 'text-blue-500'}
                py-3 px-4 bg-white  text-blue-500 shadow-lg hover:bg-gradient-to-r from-cyan-500 to-blue-500  hover:text-white border border-white rounded-lg mx-3 w-full flex justify-between items-center`}
            >
              <span>{label}</span>
              <UpIcon className={`md:h-5 md:w-5 w-3 h-3 ${!open ? 'transform rotate-180' : ''} float-right mx-3`} />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="lg:absolute left-1/2 z-10 mt-3 w-screen max-w-fit -translate-x-1/2 transform px-4 sm:px-0 ">
                <section className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <section className="relative   bg-white  ">
                    {options?.map((item) => (
                    <Link
                    to={item.to}
                    className="flex items-center rounded-lg min-w-full transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50  border-b"
                    onClick={handleCloseSideBar}
                    key={item.to}
                  >
                    <section className="w-full">
                      <p className="py-3 px-4 hover:text-white hover:bg-gradient-to-r from-cyan-500 to-blue-500  bg-white text-blue-500 shadow-lg text-nowrap ">
                        {item.label}
                      </p>
                    </section>
                  </Link>
                  
                    ))}
                  </section>
                </section>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </section>
  )
}

