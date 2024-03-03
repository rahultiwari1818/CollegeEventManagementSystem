import { Fragment, useRef, useState, useEffect, useMemo } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ReactComponent as UpIcon } from '../assets/Icons/up_arrow.svg';

const Dropdown = ({ dataArr, selected, setSelected, name, label, disabled,passedId }) => {
  const dropdownRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState('bottom-0');

  useEffect(() => {
    function handlePosition() {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      console.log(dropdownRect)
      if (dropdownRect.top+200 < window.innerHeight) {
        setMenuPosition('top-full');
      } else {
        setMenuPosition('bottom-0');
      }
    }
    handlePosition(); // Initialize menu position
    window.addEventListener('resize', handlePosition);
    return () => window.removeEventListener('resize', handlePosition);
  }, []);

  const handleInputChange = (e) => {
    if(passedId){
      setSelected(e._id)
    }
    else{
      setSelected(e.name);
    }
  };


  const showSelected = useMemo(()=>{
    if(passedId){
      const data =  dataArr.find(data=>data?._id===selected);
      return data?.name;
    }
         const data =  dataArr.find(data=>data?.name===selected);
        return data?.name
  },[selected])



  return (
    <div className="w-full relative" ref={dropdownRef}>
      <Listbox value={selected} disabled={disabled} onChange={handleInputChange}
      
      >
        {({ open }) => (
          <div className="relative mt-1">
            <Listbox.Button className="relative flex gap-5 justify-between w-full cursor-default rounded-lg bg-white py-3 pl-3 pr-10 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300"
            >
              <span className="block truncate">{selected ? showSelected : label}</span>
              <span>
                <UpIcon className={`md:h-5 md:w-5 w-3 h-3 ${!open ? 'transform rotate-180' : ''} float-right`} />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className={`absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10 ${menuPosition}`}>
                {dataArr.map((option, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-10 ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.name}
                        </span>
                        {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"></span>}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default Dropdown;

