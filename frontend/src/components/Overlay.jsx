import React from 'react'
import { Hourglass } from 'react-loader-spinner';

export default function Overlay({ message, showWhiteBg }) {
  return (
    <section className={`fixed z-50 h-screen w-screen top-0 right-0 bottom-0 left-0 flex justify-center items-center  ${showWhiteBg ? 'bg-white' : 'bg-gray-100 bg-opacity-80'}    `}>
      <Hourglass
        visible={true}
        height="80"
        width="80"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={['#306cce', '#72a1ed']} />
    </section>
  )
}
