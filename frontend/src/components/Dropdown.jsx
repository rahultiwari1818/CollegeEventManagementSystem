
import { Fragment, forwardRef, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ReactComponent as UpIcon } from '../assets/Icons/up_arrow.svg';

const Dropdown = forwardRef(({ people, selected, setSelected, name, label }, ref) => {

  useEffect(()=>{
    // handleInputChange()
    if(selected === "Individual"){
      ref.current.value = 1;
      ref.current.disabled = true;
    }
    else if(selected === "Group"){
      ref.current.disabled = false;
    }
  },[])

  const handleInputChange = (e) => {
    if (e.name === 'Individual') {
      setSelected((oldSelected) => ({
        ...oldSelected,
        noOfParticipants: 1,
      }));
      
      ref.current.value = 1;
      ref.current.disabled = true;
    } else if (e.name === 'Group') {
      ref.current.disabled = false;
      setSelected((oldSelected) => ({
        ...oldSelected,
        noOfParticipants: 1,
      }));
    }
    setSelected((oldSelected) => ({
      ...oldSelected,
      [name]: e.name,
    }));
  };

  return (
    <div className="w-full">
      <Listbox value={selected} onChange={handleInputChange} >
        <div className="relative mt-1">
          <Listbox.Button  className="relative flex gap-5 justify-between w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 ">
            <span className="block truncate">{selected ? selected : label}</span>
            <span>
              <UpIcon className="md:h-5 md:w-5 w-3 h-3 ui-not-open:transform ui-not-open:rotate-180 float-right" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
              {people.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-blue-500 text-red-500' : 'text-gray-900'
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {person.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"></span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
});

export default Dropdown;
