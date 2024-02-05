import React, { useEffect, useState } from 'react'

export default function Search({placeholder,searchValue,changeSearch}) {
    const [search,setSearch] = useState(searchValue)
    
    useEffect(()=>{
        changeSearch(search)
    },[search])
  return (
    <section>
        <input type="search" name="search" value={search} onChange={(e)=>{setSearch(()=>e.target.value)}} placeholder={placeholder} className='mx-2 my-3 px-3 py-2 rounded-md shadow-md'/>
    </section>
  )
}
