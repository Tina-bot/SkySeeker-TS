import Image from 'next/image'
import React from 'react'

type Props = {};

export default function WeatherIcon(
    props: React.HTMLProps<HTMLDivElement> & { iconName: string }
) {
    return (
        <div className='relative h-20 w-20'>
            <div className="absolute inset-0 flex items-center justify-center shadow-md bg-violet-200 rounded-full">
                <Image
                    width={100}
                    height={100}
                    alt="weather-icon"
                    className="h-full w-full object-contain"
                    src={`https://openweathermap.org/img/wn/${props.iconName}@4x.png`}
                />
            </div>
        </div>
    )
}