import React, { useEffect, useState } from 'react'
import { CgProfile } from "react-icons/cg";
import { IoMdBook } from "react-icons/io";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Mode = { Dark: 'dark', Light: 'light' }

export default function SideNav() {
    const [mode, setMode] = useState(null)
    const soon = () => toast.info("Soon!...", {
        pauseOnHover: false,
        draggable: true,
        closeOnClick: true,
    });

    useEffect(() => {
        if (localStorage.getItem('theme')) {
            setMode(localStorage.getItem('theme'))
        } else {
            setMode(Mode.Dark)
        }
    }, [])
    useEffect(() => {
        if (mode === Mode.Light) {
            localStorage.setItem('theme', Mode.Light)
            document.documentElement.classList.remove(Mode.Dark)
            document.documentElement.classList.remove('bg-slate-900')
        } else if (mode === Mode.Dark) {
            localStorage.setItem('theme', Mode.Dark)
            document.documentElement.classList.add(Mode.Dark)
            document.documentElement.classList.add('bg-slate-900')
        }

    }, [mode])


    return <>
        <div className="h-screen fixed top-0 left-0  ">
            <aside className="h-full w-16 flex flex-col space-y-10 items-center justify-center relative bg-gray-200 dark:bg-gray-800 dark:text-white ">
                <div onClick={soon} className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
                    <CgProfile size={25} />
                </div>

                <div onClick={soon} className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
                    <IoMdBook size={25} />
                </div>

                {mode === Mode.Dark ?
                    <div onClick={() => setMode(Mode.Light)} className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
                        <MdOutlineLightMode size={25} />
                    </div> :
                    <div onClick={() => setMode(Mode.Dark)} className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
                        <MdOutlineDarkMode size={25} />
                    </div>

                }

                <div onClick={soon} className="h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer hover:text-gray-800 hover:bg-white  hover:duration-300 hover:ease-linear focus:bg-white">
                    <IoSettingsOutline size={25} />

                </div>
            </aside>
        </div>
        <ToastContainer
            theme={mode === Mode.Dark ? Mode.Light : Mode.Dark}
        />
    </>
}
