import { Combobox, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react'

export default function FacultyCombobox({ label, placeholder, peopleData, disabled, searchFaculty, updateSelectedFaculty }) {

    const [selected, setSelected] = useState();
    const [query, setQuery] = useState('');


    const handleSelectOption = (data) => {
        setSelected(data)
        updateSelectedFaculty(data)
    }

    const handleChangeInput = (e) => {
        const search = e.target.value;
        setQuery(search);
    }

    useEffect(() => {
        searchFaculty(query);

    }, [query]);


    return (
        <section className="my-2">
            <Combobox value={selected} onChange={handleSelectOption} disabled={disabled}>
                <Combobox.Label>{label}</Combobox.Label>
                <section className="relative mt-1">
                    <section className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue={(person) => person?.email}
                            onChange={handleChangeInput} // Use handleChangeInput for input change
                            placeholder={placeholder}
                            value={query}
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
                        <Combobox.Options className="absolute mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                            {
                                peopleData.length === 0 ?
                                    <Combobox.Option className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gradient-to-r from-cyan-500 to-blue-500  text-white' : 'text-gray-900'
                                        }`
                                    }
                                        disabled={true}

                                    >
                                        No Faculties Found
                                    </Combobox.Option>
                                    :
                                    peopleData?.map((person) => (
                                        <Combobox.Option
                                            key={person.email}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gradient-to-r from-cyan-500 to-blue-500  text-white' : 'text-gray-900'
                                                }`
                                            }
                                            value={person}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                            }`}
                                                    >
                                                        {person?.email + " - " + person.name}
                                                    </span>
                                                    {selected ? (
                                                        <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-blue-500'
                                                                }`}
                                                        >
                                                            {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))}
                        </Combobox.Options>
                    </Transition>
                </section>
            </Combobox>
        </section>
    )
}
