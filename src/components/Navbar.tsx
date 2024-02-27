'use client'
import React, { useState } from 'react'
import { GiNightSky } from "react-icons/gi";
import { BiCurrentLocation } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import Searchbox from './Searchbox';
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_API_WEATHER
type Props = {}

export default function Navbar({ }: Props) {
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleImputChange = async (value: string) => {
        setCity(value);
        if (value.length >= 3) {
            try {
                const res = await axios.get(
                    `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
                );
                const suggestions = res.data.list.map((item: any) => item.name);
                setSuggestions(suggestions);
                setError("");
                setShowSuggestions(true);
            }
            catch (error) {
                console.error(error);
                setSuggestions([]);
                setShowSuggestions(true);
            }
        }
        else {
            setSuggestions([]);
            setShowSuggestions(true);
        }
    }
    return (
        <nav className='shadow-sm sticky top-0 left-0 z-50 bg-violet-50 w-full  sm:w-17'>
            <div className='h-[120px] w-full flex justify-between items-center max-w-7xl px-12 max-auto'>
                <span className='flex items-center justify-center gap-2'>
                    <GiNightSky className='text-6xl mt-1 text-violet-400' />
                    <h2 className='text-gray-500 text-3xl'>SkySeeker</h2>
                </span>
                <section className='flex flex-col gap-2 items-center pt-8 '>
                    <div className='flex align-middle gap-2 items-center'>
                        <BiCurrentLocation className='text-3xl text-gray-500 hover:text-red-500 cursor-pointer' />
                        <Searchbox value={city} onChange={(e) => handleImputChange(e.target.value)} onSubmit={undefined} />
                    </div>
                    <div className='flex italic gap-2 mt-[-5px]'>
                        <IoLocationSharp className='text-xl text-red-500 m-0' />
                        <p>Buenos Aires</p>
                    </div>
                </section>
            </div>
        </nav>
    )
}

const suggestionsBox=()=>{
    
}