'use client'
import React, { useState } from 'react'
import { GiNightSky } from "react-icons/gi";
import { BiCurrentLocation } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import Searchbox from './Searchbox';
import axios from 'axios';
import { loadingCityAtom, placeAtom } from '@/app/atom';
import { useAtom } from 'jotai';

const API_KEY = process.env.NEXT_PUBLIC_API_WEATHER
type Props = { location?: string }

export default function Navbar({ location }: Props) {
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [place, setPlace] = useAtom(placeAtom);
    const [_, setLoadingCity] = useAtom(loadingCityAtom)

    const handleImputChange = async (value: string) => {
        setCity(value);
        if (value.length >= 3) {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
                );

                const suggestions = response.data.list.map((item: any) => item.name);
                setSuggestions(suggestions);
                setError("");
                setShowSuggestions(true);
            } catch (error) {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }

    function handleSuggestionClick(value: string) {
        setCity(value);
        setShowSuggestions(false);
    }
    const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
        setLoadingCity(true);
        e.preventDefault();
        if (suggestions.length == 0) {
            setError("Location not found");
            setLoadingCity(false);
        }
        else {
            setError("");
            setTimeout(() => {
                setLoadingCity(false);
                setShowSuggestions(false);
                setPlace(city);
            }, 500);
        }
    }

    function handleCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (postiion) => {
                const { latitude, longitude } = postiion.coords;
                try {
                    setLoadingCity(true);
                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
                    );
                    setTimeout(() => {
                        setLoadingCity(false);
                        setPlace(response.data.name);
                    }, 500);
                } catch (error) {
                    setLoadingCity(false);
                }
            });
        }
    }

    return (<>
        <nav className='shadow-sm sticky top-0 left-0 z-50 bg-violet-50 w-full sm:w-17'>
            <div>
                <div className='h-[110px] w-full flex justify-between items-center max-w-7xl px-12 max-auto'>
                    <span className='flex items-center justify-center gap-2'>
                        <GiNightSky className='text-6xl mt-1 text-violet-400' />
                        <h2 className='text-gray-500 text-3xl'>SkySeeker</h2>
                    </span>
                    <section className='flex flex-col gap-2 items-center pt-8 '>
                        <div className='flex align-middle gap-2 items-center'>
                            <BiCurrentLocation className='text-3xl text-gray-500 hover:text-red-500 cursor-pointer' onClick={handleCurrentLocation} />
                            <Searchbox value={city} onChange={(e) => handleImputChange(e.target.value)} onSubmit={handleSubmitSearch} />
                        </div>
                        <div className='flex italic gap-2 mt-[-5px]'>
                            <IoLocationSharp className='text-xl text-red-500 m-0' />
                            <p>{location}</p>
                            <div className='relative'>
                                <SuggetionBox {...{ showSuggestions, suggestions, handleSuggestionClick, error }} />
                            </div>
                        </div>
                    </section>
                </div>
                <section className="flex max-w-7xl px-3 md:hidden ">
                    <div className="relative hidden md:flex ">

                        <Searchbox
                            value={city}
                            onSubmit={handleSubmitSearch}
                            onChange={(e) => handleImputChange(e.target.value)}
                        />
                        <SuggetionBox
                            {...{
                                showSuggestions,
                                suggestions,
                                handleSuggestionClick,
                                error
                            }}
                        />
                    </div>
                </section>
            </div>
        </nav>
        <section className="flex  max-w-7xl px-3 md:hidden ">
            <div className="relative ">
                <Searchbox
                    value={city}
                    onSubmit={handleSubmitSearch}
                    onChange={(e) => handleImputChange(e.target.value)}
                />
                <SuggetionBox
                    {...{
                        showSuggestions,
                        suggestions,
                        handleSuggestionClick,
                        error
                    }}
                />
            </div>
        </section>
    </>
    );
}

function SuggetionBox({
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    error
}: {
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (item: string) => void;
    error: string;
}) {
    return (
        <>
            {((showSuggestions && suggestions.length > 1) || error) && (
                <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]  flex flex-col gap-1 py-2 px-2">
                    {error && suggestions.length < 1 && (
                        <li className="text-red-500 p-1 "> {error}</li>
                    )}
                    {suggestions.map((item, i) => (
                        <li
                            key={i}
                            onClick={() => handleSuggestionClick(item)}
                            className="cursor-pointer p-1 rounded   hover:bg-gray-200"
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}