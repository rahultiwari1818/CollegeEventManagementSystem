import React, { useEffect, useRef, useState } from 'react';
import DefaultImage from "../assets/images/DefaultUser.png";
import { useSelector } from 'react-redux';
import axios from 'axios';
import Modal from '../components/Modal';
import { toast } from "react-toastify";
import Overlay from './Overlay';

export default function ChangeProfilPic({ isOpen, close, heading, imgUrl, changeProfilePicURL }) {

    const API_URL = process.env.REACT_APP_BASE_URL;
    const token = localStorage.getItem("token");
    const imageSrc = imgUrl === "." ? DefaultImage : imgUrl;

    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);
    const user = useSelector((state) => state.UserSlice);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Handle the selected file here (e.g., upload to server)
        setSelectedFile(file);
    };

    const uploadNewProfilePic = async () => {

        try {
            setIsLoading(true)
            const route = user.role === "Student" ? `students/changeProfilePhoto` : `faculties/changeProfilePhoto`;

            const formData = new FormData();
            formData.append("profilePic", selectedFile);
            const { data } = await axios.post(`${API_URL}/api/${route}`, formData, {
                headers: {
                    "auth-token": token,
                    "Content-Type": "multipart/form-data"
                }
            })

            if (data.result) {
                toast.success(data.message);
                changeProfilePicURL({ profilePicPath: data.data.profilePicPath, profilePicName: data.data.profilePicName })
                close();
            }

        } catch ({ response }) {
            toast.error(response?.data.message)
        }
        finally {
            setIsLoading(false)

        }

    }

    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
        }
    }, [isOpen])

    return (
        <>

            {
                isLoading
                &&
                <Overlay />
            }

            <Modal isOpen={isOpen} close={close} heading={heading}>
                <section>
                    <section className="flex justify-center items-center">
                        <img
                            className="w-28 h-28 sm:w-40 sm:h-40 object-cover rounded-full shadow-md"
                            src={imageSrc}
                            alt="Profile"
                        />
                    </section>


                    <section className="my-2 flex flex-col items-center">
                        {selectedFile && (
                            <p className="mb-2">
                                Filename: {selectedFile.name}, Size: {selectedFile.size} bytes
                            </p>
                        )}
                        <input
                            type="file"
                            name="profilePic"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {
                            !selectedFile ?
                                <button
                                    className="px-5 py-2 shadow-lg rounded-lg bg-blue-500 text-white hover:bg-white hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    onClick={handleButtonClick}
                                >
                                    Change Profile Photo
                                </button>
                                :
                                <button
                                    className="px-5 py-2 shadow-lg rounded-lg bg-yellow-500 text-white hover:bg-white hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    onClick={uploadNewProfilePic}
                                >
                                    Upload
                                </button>
                        }
                    </section>
                </section>
            </Modal>
        </>
    )
}