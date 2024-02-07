import React from 'react'
import { GiNightSky } from "react-icons/gi";
import { BiCurrentLocation } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import Searchbox from './Searchbox';


type Props = {}

export default function Navbar({ }: Props) {
    return (
        <nav className='shadow-sm sticky top-0 left-0 z-50 bg-violet-100'>
            <div className='h-[120px] w-full flex justify-between items-center max-w-7xl px-12 max-auto'>
                <span className='flex items-center justify-center gap-2'>
                    <GiNightSky className='text-6xl mt-1 text-violet-400' />
                    <h2 className='text-gray-500 text-3xl'>SkySeeker</h2>
                </span>
                <section className='flex flex-col gap-2 items-center pt-8 '>
                    <div className='flex align-middle gap-2 items-center'>
                        <BiCurrentLocation className='text-3xl text-gray-500 hover:text-red-500 cursor-pointer' />
                        <Searchbox value={''} onChange={undefined} onSubmit={undefined} />
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