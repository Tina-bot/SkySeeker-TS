import React from 'react'
import { IoIosSearch } from "react-icons/io";

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export default function Searchbox(props: Props) {
    return (
        <form action="" onSubmit={props.onSubmit} className='flex relative items-center border-2 bg-white rounded-full active:border-violet-400 focus-within:rounded-full focus:border-2 focus-within:border-violet-400'>
            <input type="text"
                value={props.value}
                onChange={props.onChange}
                className='h-8 outline-none ml-2  '
                placeholder=' Location..' />
            <button className='bg-violet-400 text-white rounded-full focus:outline-none hover:bg-violet-600 h-full'>
                <IoIosSearch className='text-3xl rounded-e-full  m-1' />
            </button>
        </form>
    )
}