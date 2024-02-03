import React, { useState } from 'react'
import { formatFileSize } from '../utils';
import { ReactComponent as FileUploadIcon } from "../assets/Icons/FileUploadIcon.svg";

export default function AddStudents() {

    const [fileToUpload,setFileToUpload] = useState(null);

  return (
    <>
<section className='md:p-2 md:m-2  p-1 m-1'>
    <section className="flex items-center justify-center w-full">
        <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
            <section className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUploadIcon className="h-10 w-10" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to Upload</span> or Drag and Drop Student CSV or XLS File
                </p>
            </section>
            <section className="mt-2">
                {true ? (
                    <>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Selected File: {fileToUpload?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Selected File Size : {formatFileSize(fileToUpload?.size || 0)}
                        </p>
                    </>
                ) : null}
            </section>
            <input
                type="file"
                id="dropzone-file"
                name="ebrochure"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files[0];
                    setFileToUpload(file);
                }}
                accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
        </label>
    </section>
</section>

</>
    
  )
}
