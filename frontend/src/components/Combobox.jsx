import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'


export default function ComboboxComp({label,placeholder,studentData,disabled}) {
  const [selected, setSelected] = useState()
  const [query, setQuery] = useState('')

  useEffect(()=>{
    setSelected(studentData)
  },[studentData])

  return (
    <section className=" ">
      <Combobox value={selected} onChange={setSelected} disabled={disabled}>
      <Combobox.Label>{label}</Combobox.Label>
        <section className="relative mt-1">
          <section className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(student) => student.sid}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              {/* <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              /> */}
            </Combobox.Button>
          </section>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {[].length === 0 && query !== '' ? (
                <section className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </section>
              ) : (
                [].map((student) => (
                  <Combobox.Option
                    key={student.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-500 text-white' : 'text-black'
                      }`
                    }
                    value={student}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {student.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </section>
      </Combobox>
    </section>
  )
}
