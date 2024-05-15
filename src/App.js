import './App.css';
import { useState } from 'react';
import SideNav from './Components/SideNav';
import Pagination from '@mui/material/Pagination';
import { FaMinusCircle } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaSort } from "react-icons/fa";



function App() {
  const [page, setPage] = useState(1)

  const changePage = (e, value) => {
    setPage(value)
  }
  return <>
    <div className="App min-h-screen text-slate-900 bg-grey-100 dark:bg-slate-950 dark:text-white ">
      <SideNav />

      <main className='ms-16 pt-6 p-2 '>
        <div className="container mx-auto px-4">

          <div className='table-title bg-sky-900 text-center sm:flex sm:justify-between p-4'>
            <div className='title text-slate-100 text-2xl mb-2 sm:mb-0'>Manage <span className='font-bold'>Students</span></div>
            <div className='title-buttons sm:flex justify-center'>
              <button className='flex items-center bg-red-600 text-slate-100 px-5 py-3 sm:px-6 sm:py-2 hover:bg-red-800 focus:ring-4 focus:ring-red-300 mb-3 sm:mb-0 mx-auto'>
                <FaMinusCircle size={20} />
                <span className='ps-2'>Delete</span>
              </button>
              <button className='flex items-center bg-green-600 text-slate-100 px-5 py-3 sm:px-6 sm:py-2 hover:bg-green-800 focus:ring-4 focus:ring-green-300 sm:ms-2 mx-auto'>
                <FaPlusCircle size={20} />
                <span className='ps-2'>Add New Student</span>
              </button>

            </div>
          </div>

          <div className="table-content overflow-x-auto shadow-md ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-0 ps-2 py-3 text-center">
                    <input type="checkbox" className="w-5 h-5 rounded accent-cyan-600	" />
                  </th>
                  <th scope="col" className="px-6 py-3 flex items-center">
                    Name
                    <FaSort className='cursor-pointer hover:text-slate-500' size={15} />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Enroll Number
                  </th>
                  <th scope="col" className="px-6 py-3 flex items-center">
                    Date Of Admission
                    <FaSort className='cursor-pointer hover:text-slate-500' size={15} />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-100 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="px-0 ps-2 py-4 text-center">
                    <input type="checkbox" className="w-5 h-5 rounded accent-cyan-600	" />
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Peter Sameh
                  </th>
                  <td className="px-6 py-4">
                    Petersameh953@gmail.com
                  </td>
                  <td className="px-6 py-4">
                    +20120819905
                  </td>
                  <td className="px-6 py-4">
                    19279288000
                  </td>
                  <td className="px-6 py-4">
                    08-Dec, 2021
                  </td>
                  <td className="px-6 py-4 flex">
                    <div className='edit relative group me-3'>
                      <MdEdit className='text-yellow-500 cursor-pointer hover:text-yellow-700' size={23} />
                      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                        Edit
                      </div>
                    </div>
                    <div className='delete relative group'>
                      <MdDelete className='text-red-500 cursor-pointer hover:text-red-700' size={23} />
                      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                        Delete
                      </div>
                    </div>


                  </td>
                </tr>
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-100 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="px-0 ps-2 py-4 text-center">
                    <input type="checkbox" className="w-5 h-5 rounded accent-cyan-600	" />
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Peter Sameh
                  </th>
                  <td className="px-6 py-4">
                    Petersameh953@gmail.com
                  </td>
                  <td className="px-6 py-4">
                    +20120819905
                  </td>
                  <td className="px-6 py-4">
                    19279288000
                  </td>
                  <td className="px-6 py-4">
                    08-Dec, 2021
                  </td>
                  <td className="px-6 py-4 flex">
                    <div className='edit relative group me-3'>
                      <MdEdit className='text-yellow-500 cursor-pointer hover:text-yellow-700' size={23} />
                      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                        Edit
                      </div>
                    </div>
                    <div className='delete relative group'>
                      <MdDelete className='text-red-500 cursor-pointer hover:text-red-700' size={23} />
                      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                        Delete
                      </div>
                    </div>


                  </td>
                </tr>
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-100 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="px-0 ps-2 py-4 text-center">
                    <input type="checkbox" className="w-5 h-5 rounded accent-cyan-600	" />
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Peter Sameh
                  </th>
                  <td className="px-6 py-4">
                    Petersameh953@gmail.com
                  </td>
                  <td className="px-6 py-4">
                    +20120819905
                  </td>
                  <td className="px-6 py-4">
                    19279288000
                  </td>
                  <td className="px-6 py-4">
                    08-Dec, 2021
                  </td>
                  <td className="px-6 py-4 flex">
                    <div className='edit relative group me-3'>
                      <MdEdit className='text-yellow-500 cursor-pointer hover:text-yellow-700' size={23} />
                      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                        Edit
                      </div>
                    </div>
                    <div className='delete relative group'>
                      <MdDelete className='text-red-500 cursor-pointer hover:text-red-700' size={23} />
                      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                        Delete
                      </div>
                    </div>


                  </td>
                </tr>
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-100 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="px-0 ps-2 py-4 text-center">
                    <input type="checkbox" className="w-5 h-5 rounded accent-cyan-600	" />
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Peter Sameh
                  </th>
                  <td className="px-6 py-4">
                    Petersameh953@gmail.com
                  </td>
                  <td className="px-6 py-4">
                    +20120819905
                  </td>
                  <td className="px-6 py-4">
                    19279288000
                  </td>
                  <td className="px-6 py-4">
                    08-Dec, 2021
                  </td>
                  <td className="px-6 py-4 flex">
                    <div className='edit relative group me-3'>
                      <MdEdit className='text-yellow-500 cursor-pointer hover:text-yellow-700' size={23} />
                      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                        Edit
                      </div>
                    </div>
                    <div className='delete relative group'>
                      <MdDelete className='text-red-500 cursor-pointer hover:text-red-700' size={23} />
                      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                        Delete
                      </div>
                    </div>


                  </td>
                </tr>
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-100 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="px-0 ps-2 py-4 text-center">
                    <input type="checkbox" className="w-5 h-5 rounded accent-cyan-600	" />
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Peter Sameh
                  </th>
                  <td className="px-6 py-4">
                    Petersameh953@gmail.com
                  </td>
                  <td className="px-6 py-4">
                    +20120819905
                  </td>
                  <td className="px-6 py-4">
                    19279288000
                  </td>
                  <td className="px-6 py-4">
                    08-Dec, 2021
                  </td>
                  <td className="px-6 py-4 flex">
                    <div className='edit relative group me-3'>
                      <MdEdit className='text-yellow-500 cursor-pointer hover:text-yellow-700' size={23} />
                      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                        Edit
                      </div>
                    </div>
                    <div className='delete relative group'>
                      <MdDelete className='text-red-500 cursor-pointer hover:text-red-700' size={23} />
                      <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                        Delete
                      </div>
                    </div>


                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='pagination sm:flex justify-between mt-4'>
            <span>Showing <b>5</b> out of <b>25</b> items</span>
            <Pagination className='mt-5 sm:mt-0' count={11} page={page} color="primary" onChange={changePage} />
          </div>


        </div>
      </main >
    </div >
  </>
}

export default App;
