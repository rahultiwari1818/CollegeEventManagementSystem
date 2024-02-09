import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as UpIcon } from '../assets/Icons/up_arrow.svg';

// const solutions = [
//   {
//     name: 'Insights',
//     description: 'Measure actions your users take',
//     href: '##',
//   },
//   {
//     name: 'Automations',
//     description: 'Create your own targeted content',
//     href: '##',
//   },
//   {
//     name: 'Reports',
//     description: 'Keep track of your growth',
//     href: '##',
//   },
// ]


export default function Example({options,label,closeSideBar}) {

    const handleCloseSideBar = () =>{
        if(closeSideBar){
            closeSideBar();
        }
    }

  return (
    <section className=" my-3 md:my-0">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? 'text-white' : 'text-white/90'}
                py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3`}
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
              <Popover.Panel className="md:absolute left-1/2 z-10 mt-3 w-screen max-w-80 -translate-x-1/2 transform px-4 sm:px-0 ">
                <section className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <section className="relative   bg-white py-3 ">
                    {options?.map((item) => (
                      <Link
                        to={item.to}
                        className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50"
                        onClick={handleCloseSideBar}
                      >
                        <section className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                          {/* <item.icon aria-hidden="true" /> */}
                        </section>
                        <section className="ml-4">
                          <p className="py-3 px-4 bg-green-500  text-white shadow-lg rounded-lg mx-3">
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

