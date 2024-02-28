import React from 'react'
import { Bars } from 'react-loader-spinner';

export default function Overlay({ message,showWhiteBg }) {
  return (
    <section className={  `fixed z-50 h-screen w-screen top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-opacity-80 ${showWhiteBg ? 'bg-white' :'bg-gray-100'}    `}>
      <Bars
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </section>
  )
}
