import React from 'react';
import DefaultImage from "../assets/images/DefaultUser.png";
import {ReactComponent as CameraIcon} from "../assets/Icons/CameraIcon.svg"
export default function Profile() {
  return (
    <section className="h-full sm:p-0 my-5 shadow-lg">
    <section className="flex items-center justify-center">
        <section className="max-w-lg w-full bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            <section className="bg-blue-500">
            <section className="uppercase tracking-wide text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center py-5 sm:py-8 text-white font-semibold">
                Student Profile
            </section>
            <section className="w-full">
                <section className="max-w-fit mx-auto rounded-full shadow-md p-1 bg-gray-50">
                    <img
                        className="w-28 h-28 sm:w-40 sm:h-40 object-cover rounded-full shadow-md"
                        src={DefaultImage}
                        alt="Student identity"
                    />
                    <section className="relative">
                        <CameraIcon className="absolute ml-16 md:ml-24 -mt-5 cursor-pointer  bg-white px-3 py-2 rounded-full border border-black w-fit h-fit"/>
                    </section>

                </section>
            </section>
            </section>
            <section className="">
                <section className="p-8 md:justify-between border">
                    <section className="">
                        <section className="mt-4 grid grid-cols-2">
                            <section className="text-gray-500">Name:</section>
                            <section className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                John Doe
                            </section>
                        </section>
                        <section className="mt-4 grid grid-cols-2">
                            <section className="text-gray-500">SID:</section>
                            <section className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                123456
                            </section>
                        </section>
                        <section className="mt-4 grid grid-cols-2">
                            <section className="text-gray-500">Course:</section>
                            <section className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                Computer Science
                            </section>
                        </section>
                        <section className="mt-4 grid grid-cols-2">
                            <section className="text-gray-500">Roll No:</section>
                            <section className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                                CS-1234
                            </section>
                        </section>
                    </section>
                    <section className="mt-4 grid grid-cols-2">
                        <section className="text-gray-500">Semester:</section>
                        <section className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                            5th
                        </section>
                    </section>
                    <section className="mt-4 grid grid-cols-2">
                        <section className="text-gray-500">Date of Birth:</section>
                        <section className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                            01/01/2000
                        </section>
                    </section>
                    <section className="mt-4 grid grid-cols-2">
                        <section className="text-gray-500">Gender:</section>
                        <section className="mt-1 text-md sm:text-lg leading-tight font-medium text-black">
                            Male
                        </section>
                    </section>
                </section>
            </section>
        </section>
    </section>
</section>
  )
}
