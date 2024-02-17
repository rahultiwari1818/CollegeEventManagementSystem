import React, { useEffect, useState } from 'react';
import {ReactComponent as SearchIcon} from "../assets/Icons/Search.svg";

export default function Search({placeholder,searchValue,changeSearch}) {
    const [search,setSearch] = useState(searchValue)
    
    useEffect(()=>{
        changeSearch(search)
    },[search])
  return (
<section className="relative">
    <input type="search" name="search" value={search} onChange={(e)=>{setSearch(()=>e.target.value)}} placeholder={placeholder} className="md:mx-2  px-4 py-3 my-1 rounded-md shadow-md w-full "/>
    {
      search == "" 
      &&
    <section className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none px-5">
      <SearchIcon/>
    </section>
    }
</section>

  )
}
