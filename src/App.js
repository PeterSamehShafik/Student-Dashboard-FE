import './App.css';
import { useEffect, useState } from 'react';
import SideNav from './Components/SideNav';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import Joi from 'joi';

//modal
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

//icons
import { FaMinusCircle } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaSort } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { VscLoading } from "react-icons/vsc";
import { AiOutlineCheck } from 'react-icons/ai';
import { LiaUserEditSolid } from "react-icons/lia";
import { CiSearch } from "react-icons/ci";


import axios from 'axios';
import Loading from './Components/Loading/Loading';




function App() {

  const BASEURL = `https://student-dashboard-be.vercel.app/`

  const [students, setStudents] = useState(null);
  const [getLoading, setGetLoading] = useState(true);

  //Toast
  const successToast = (msg = 'Success..!') => toast.success(msg, {
    pauseOnHover: false,
    draggable: true,
    closeOnClick: true,
    autoClose: 2000
  });
  const errorToast = (msg = "Error Happened...!") => toast.error(msg, {
    pauseOnHover: true,
    draggable: true,
    closeOnClick: true,
    autoClose: 4000
  });

  //validations
  // const onBlur = e => {
  //   const { name, value } = e.target;
  //   const errorMessage = validate(name, value);
  //   setErrors({
  //     ...errors,
  //     [name]: errorMessage
  //   });
  // };


  //Add / Edit
  const modes = { edit: "Edit", add: "Add", singleDelete: "SD", deleteMany: "DM" }
  const [modalMode, setModalMode] = useState(null);
  const [openDataModal, setOpenDataModal] = useState(false);
  const closeDataModal = () => {
    if (modalMode === modes.edit) {
      setErrors({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      })
    }
    setOpenDataModal(false)
    setModalMode(null)
    setCurrentEdit(null)
  }

  //validations
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

  });
  const validate = (name, value) => {
    const schema = Joi.object({
      firstName: Joi.string().pattern(/^[A-Za-z]+$/).min(2).max(30).required().messages({
        'string.empty': 'First Name is required',
        'string.pattern.base': 'First Name must contain only alphabetic characters',
        'string.min': 'First Name must be at least 2 characters',
        'string.max': 'First Name must be less than 30 characters'
      }),
      lastName: Joi.string().pattern(/^[A-Za-z]+$/).min(2).max(30).required().messages({
        'string.empty': 'Last Name is required',
        'string.pattern.base': 'Last Name must contain only alphabetic characters',
        'string.min': 'Last Name must be at least 2 characters',
        'string.max': 'Last Name must be less than 30 characters'
      }),
      email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'Email address is invalid',
        'string.empty': 'Email is required'
      }),
      phone: Joi.string().pattern(/^\d{11,12}$/).required().messages({
        'string.pattern.base': 'Phone number must be between 11 and 12 digits and contain only numbers',
        'string.empty': 'Phone number is required'
      }),
    });
    const obj = { [name]: value };
    const fieldSchema = schema.extract(name);
    const { error } = fieldSchema.validate(obj[name]);
    return error ? error.details[0].message : 'done';
  };
  const validateFile = (selectedFile = file) => {
    if (selectedFile?.name) {
      const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/jif', 'image/jfif', 'image/gif'];
      if (!allowedFormats.includes(selectedFile?.type)) {
        setFileError('Invalid file format. Please upload an image in PNG, JPEG, JPG, JIF, JFIF, or GIF format.');
        return false;
      }
    }
    setFileError('')
    return 'done';
  };

  //add data
  const [tableLoading, setTableLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const openAddModal = () => {
    setOpenDataModal(true)
    setModalMode(modes.add)
    setFileError('')
  }
  const handleTyping = e => {
    const { name, value } = e.target;
    const errorMessage = validate(name, value);
    setErrors({
      ...errors,
      [name]: errorMessage
    });
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    //validations
    const validationErrors = {};
    Object.keys(formData).forEach(name => {
      const errorMessage = validate(name, formData[name]);
      if (errorMessage && errorMessage !== 'done') validationErrors[name] = errorMessage;
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && validateFile()) {
      setErrors({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });
      setFileError('')
      setTableLoading(true)

      let err;
      let result = await axios.post(`${BASEURL}/add`, formData).catch(function (error) {
        if (error.response) {
          err = error.response.data.message
          console.log(error.response);
        }
      });
      if (result?.data?.message === "done") {
        successToast('User Added Successfully...!')
        if (file) {
          handleUpload(result?.data?.user?._id)
        } else {
          getStudents()
        }
      } else {
        errorToast(err)
        setOpenDataModal(false)
        setFile(null)
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      })
      setFile(null)
      setTableLoading(false)
      setOpenDataModal(false)
      setUploading(false);
    } else {
      errorToast("Please Complete Fields ")
    }

  }

  //upload image
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    validateFile(selectedFile)
  };

  const handleUpload = async (id) => {
    if (!validateFile()) {
      return;
    }
    const toastId = toast.loading("Uploading photo...")
    setUploading(true)
    setFileError(null);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await axios.patch(`${BASEURL}/${id}/profilePic`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Photo uploaded successfully:', response.data);
      if (modalMode === modes.add) {
        toast.update(toastId, { render: "Photo Added Successfully...!", type: "success", isLoading: false, autoClose: 2000 });
      } else {
        toast.update(toastId, { render: "Photo Updated Successfully...!", type: "success", isLoading: false, autoClose: 2000 });
      }

    } catch (error) {
      console.log('Error uploading photo:', error);
      setFileError('Error uploading photo. Please try again.');
      setFile(null)
      toast.update(toastId, { render: error?.response?.data.message, type: "error", isLoading: false, autoClose: 4000 });
    } finally {
      setFile(null)
    }
    setUploading(false);
    getStudents()
  };


  //edit data
  const [currentEdit, setCurrentEdit] = useState(null)
  const openEditModal = (student) => {
    setCurrentEdit(student)
    setOpenDataModal(true)
    setFileError('')
    setModalMode(modes.edit)
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone
    })
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    });
    setFileError('')

  }
  const handleEditStudent = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    Object.keys(formData).forEach(name => {
      const errorMessage = validate(name, formData[name]);
      if (errorMessage && errorMessage !== 'done') validationErrors[name] = errorMessage;
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0 && validateFile()) {
      setErrors({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      });
      setFileError('')
      setTableLoading(true)
      let err;
      let result = await axios.patch(`${BASEURL}/${currentEdit._id}/edit`, formData).catch(function (error) {
        if (error.response) {
          err = error.response.data.message
          console.log(error.response);
        }
      });
      if (result?.data?.message === "done") {
        successToast('Data Updated Successfully...!')
        if (file) {
          handleUpload(result?.data?.user?._id)
        } else {
          getStudents()
        }
      } else {
        errorToast(err)
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      })
      setFile(null)
      setTableLoading(false)
      setOpenDataModal(false)
      setCurrentEdit(null)

    } else {
      errorToast("Please check inputs ")
    }

  }



  //delete data
  const [deleteModalMode, setDeleteModalMode] = useState(null);
  const [currentDelete, setCurrentDelete] = useState(null)
  const [openRemoveModal, setOpenRemoveModal] = useState(false)
  const handleDelete = (student) => {
    setOpenRemoveModal(true)
    setCurrentDelete(student)
    setDeleteModalMode(modes.singleDelete)
  }
  const closeRemoveModal = () => {
    setOpenRemoveModal(false)
    setCurrentDelete(null)
    setDeleteModalMode(null)
  }
  const deleteStudent = async () => {
    setTableLoading(true)
    let err;
    let result = await axios.delete(`${BASEURL}/${currentDelete._id}/delete`).catch(function (error) {
      if (error.response) {
        err = error.response.data.message
        console.log(error.response);
      }
    });
    if (result?.data?.message === "done") {
      getStudents()
      successToast('User Removed Successfully...!')
    } else {
      errorToast(err)
    }
    setOpenRemoveModal(false)
    setCurrentDelete(null)
    setTableLoading(false)
  }

  //delete Many
  const [deleteIds, setDeleteIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const openDeleteModal = () => {
    setOpenRemoveModal(true)
    setDeleteModalMode(modes.deleteMany)
  }
  const handleSelection = (e, student) => {
    if (e.target.checked) {
      setDeleteIds(prevDeleteIds => [...prevDeleteIds, student._id]);
    } else {
      setDeleteIds(prevDeleteIds => prevDeleteIds.filter(id => id !== student._id));
      setSelectAll(false)
    }
  }
  const handleSelectAll = (e) => {
    setSelectAll(!selectAll)
    if (e.target.checked) {
      const allIds = students.map(student => student._id);
      setDeleteIds(allIds);
    } else {
      setDeleteIds([]);
    }

  }
  const deleteMany = async () => {
    setTableLoading(true)
    let err;
    let result = await axios.delete(`${BASEURL}/delete/many`, { data: { deleteIds } }).catch(function (error) {
      if (error.response) {
        err = error.response.data.message
        console.log(error.response);
      }
    });
    if (result?.data?.message === "done") {
      getStudents()
      successToast('User Removed Successfully...!')
    } else {
      errorToast(err)
    }
    setOpenRemoveModal(false)
    setDeleteModalMode(null)
    setTableLoading(false)
  }



  //pagination
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [totalStudents, setTotalStudents] = useState(0)
  const changePage = (e, value) => {
    setPage(value)
  }

  //search
  const [searchCategory, setSearchCategory] = useState('name')
  const [currentSearch, setCurrentSearch] = useState('')
  const search = e => {
    setCurrentSearch(e.target.value)
  }


  //get students
  const [sortName, setSortName] = useState(0)
  const [sortDate, setSortDate] = useState(0)
  const getStudents = async () => {
    setDeleteIds([])
    setSelectAll(false)
    if (!getLoading) {
      setTableLoading(true)
    }
    let err;
    let result = await axios.get(`${BASEURL}/all?search=${currentSearch}&searchBy=${searchCategory}&page=${page}&sortDate=${sortDate}&sortName=${sortName}`, formData).catch(function (error) {
      if (error.response) {
        err = error.response.data.message
        console.log(error.response);
      }
    })
    if (result?.data?.message === "done") {
      setStudents(result?.data?.students)
      setPageCount(result?.data?.totalPages)
      setTotalStudents(result?.data?.totalStudents)
    } else {
      errorToast(err)
      setStudents(null)
    };
    setGetLoading(false)
    setTableLoading(false)
  }
  useEffect(() => {
    getStudents()
  }, [page, currentSearch, sortName, sortDate, searchCategory])




  return <>
    <div className="App min-h-screen text-slate-900 bg-gray-100 dark:bg-slate-950 dark:text-white ">
      <SideNav />

      <main className='ms-16 pt-6 p-2 '>
        <div className="container mx-auto px-4">

          <div className='table-header bg-sky-900 text-center p-4 flex flex-col'>
            <div className='tools sm:flex sm:justify-between'>
              <h1 className='title text-slate-100 text-2xl mb-2 sm:mb-0'>Manage <span className='font-bold'>Students</span></h1>
              <div className='header-buttons sm:flex justify-center'>
                <button onClick={openDeleteModal} className='flex items-center bg-red-600 text-slate-100 px-5 py-3 sm:px-6 sm:py-2 hover:bg-red-800 focus:ring-4 focus:ring-red-300 mb-3 sm:mb-0 mx-auto'>
                  <FaMinusCircle size={20} />
                  <span className='ps-2'>Delete</span>
                </button>
                <button onClick={openAddModal} className='flex items-center bg-green-600 text-slate-100 px-5 py-3 sm:px-6 sm:py-2 hover:bg-green-800 focus:ring-4 focus:ring-green-300 sm:ms-2 mx-auto'>
                  <FaPlusCircle size={20} />
                  <span className='ps-2'>Add New Student</span>
                </button>

              </div>
            </div>

            <div className="search flex min-w-md mt-4">
              <div className='search-bar flex justify-center w-full'>
                <div className="relative w-96">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <CiSearch />
                  </div>
                  <input onChange={search} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Name, Email, Phone..." />
                  <select onChange={e => setSearchCategory(e.target.value)} id="searchBy" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <option selected disabled >Search By:</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>
            </div>
          </div>



          <div className="table-content overflow-x-auto shadow-md ">
            {getLoading ?
              <div className='w-100 flex justify-center my-2 py-2'><Loading /></div>
              :
              !students?.length ?
                <div className='w-100 flex justify-center mb-2 py-4 border-red'>
                  <span className='text-3xl text-center '>No Users Found</span>
                </div>
                :
                <>
                  <table className="relative w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-0 ps-2 py-3 text-center">
                          <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="w-5 h-5 rounded accent-cyan-600	" />
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Photo
                        </th>
                        <th scope="col" className="px-6 py-3 flex items-center">
                          Name
                          <FaSort onClick={() => setSortName(sortName === '1' ? '-1' : '1')} className='cursor-pointer ms-3 hover:text-slate-500' size={15} />
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
                          <FaSort onClick={() => setSortDate(sortDate === 0 ? '-1' : '1')} className='cursor-pointer ms-3 hover:text-slate-500' size={15} />
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody >
                      {students.map((student, idx) =>
                        <tr key={student._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-100 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                          <td className="px-0 ps-2 py-4 text-center">
                            <input type="checkbox" checked={deleteIds.includes(student._id)}
                              onChange={(e) => handleSelection(e, student)} className="w-5 h-5 rounded accent-cyan-600	" />
                          </td>
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {student.profilePic?.secure_url ?
                              <Avatar alt={student.firstName} src={student.profilePic?.secure_url} />
                              :
                              <Avatar alt={student.firstName}>{(student.firstName).charAt(0)}{(student.lastName).charAt(0)}</Avatar>

                            }
                          </th>
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {student.firstName} {student.lastName}
                          </th>
                          <td className="px-6 py-4">
                            {student.email}
                          </td>
                          <td className="px-6 py-4">
                            {student.phone}
                          </td>
                          <td className="px-6 py-4">
                            {student._id}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(student.createdAt).toDateString().split(' ').slice(1).join(' ')}
                          </td>
                          <td className="px-6 py-4 flex">
                            <div onClick={() => openEditModal(student)} className='edit relative group me-3'>
                              <MdEdit className='text-yellow-500 cursor-pointer hover:text-yellow-700' size={23} />
                              <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                                Edit
                              </div>
                            </div>
                            <div onClick={() => handleDelete(student)} className='delete relative group'>
                              <MdDelete className='text-red-500 cursor-pointer hover:text-red-700' size={23} />
                              <div className="absolute bottom-full left-1/2 mb-2 hidden w-max px-2 py-1 text-sm text-white bg-gray-800 rounded opacity-0 transform -translate-x-1/2 group-hover:block group-hover:opacity-100 transition-opacity">
                                Delete
                              </div>
                            </div>


                          </td>
                        </tr>

                      )}

                    </tbody>
                    {tableLoading && <div className="absolute top-0 start-0 bg-slate-400 dark:bg-slate-950 !bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
                      <div className="flex items-center">
                        <VscLoading className="animate-spin dark:text-gray-200" size={50} />
                      </div>
                    </div>}
                  </table>
                </>

            }
          </div>

          <div className='pagination sm:flex justify-between mt-4'>
            <span>Showing <b>{students?.length}</b> out of <b>{totalStudents}</b> items</span>
            <Pagination className='mt-5 sm:mt-0' count={pageCount} page={page} color="primary" siblingCount={0} onChange={changePage} />
          </div>


        </div>

        {/* Add/Edit Modal */}
        <Modal
          open={openDataModal} onClose={closeDataModal} center closeOnOverlayClick={false} animationDuration={100}
          classNames={{ modal: 'md:!w-dvw !text-slate-900 !bg-gray-100 dark:!bg-slate-800 dark:!text-white' }}
          closeIcon={<IoCloseCircleSharp size={25} className='hover:text-sky-500' />}
        >
          <h2 className='text-2xl mb-3'>{modalMode === modes.add ? "Add New Student" : "Edit Current Student"}</h2>
          <form className='w-100' onSubmit={modalMode === modes.add ? handleAddStudent : handleEditStudent}>

            <div className="mb-4 relative">
              <input
                type="file"
                onChange={handleFile}
                className="hidden"
                id="fileInput"
                disabled={uploading}
                accept=".png, .jpg, .jpeg, .gif"

              />
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="fileInput">{uploading ? 'Uploading...' : 'Choose Photo'}</label>
              <label
                htmlFor="fileInput"
                className="bg-blue-500 text-white py-2 px-4 mt-3 rounded cursor-pointer hover:bg-blue-600"
                disabled={uploading}
              >{uploading ? 'Uploading...' : file ? file.name : 'Choose Photo'}</label>

              {fileError === 'done' && <AiOutlineCheck className="absolute right-3 top-10 text-green-500" />}
              {fileError && fileError !== 'done' && <>
                <p className="text-red-500 text-xs italic mt-3">{fileError}</p>
              </>}
            </div>


            <div className="mb-4 relative">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="firstName">First Name <span className='text-red-500'>*</span> </label>
              <input
                className={`${errors.firstName === 'done' ? 'border-green-500 ' : errors.firstName ? 'border-red-500 ' : ''} !border-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="firstName"
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleTyping}
                required
              />
              {errors.firstName === 'done' && <AiOutlineCheck className="absolute right-3 top-10 text-green-500" />}
              {errors.firstName && errors.firstName !== 'done' && <>
                <p className="text-red-500 text-xs italic">{errors.firstName}</p>
              </>}

            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="lastName">Last Name <span className='text-red-500'>*</span> </label>
              <input
                className={`${errors.lastName === 'done' ? 'border-green-500 ' : errors.lastName ? 'border-rose-500 ' : ''} !border-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="lastName"
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleTyping}
                required
              />
              {errors.lastName === 'done' && <AiOutlineCheck className="absolute right-3 top-10 text-green-500" />}
              {errors.lastName && errors.lastName !== 'done' && <>
                <p className="text-red-500 text-xs italic">{errors.lastName}</p>
              </>}

            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">Email <span className='text-red-500'>*</span> </label>
              <input
                className={`${errors.email === 'done' ? 'border-green-500 ' : errors.email ? 'border-red-500 ' : ''} !border-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="email"
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleTyping}
                required
              />
              {errors.email === 'done' && <AiOutlineCheck className="absolute right-3 top-10 text-green-500" />}
              {errors.email && errors.email !== 'done' && <>
                <p className="text-red-500 text-xs italic">{errors.email}</p>
              </>}

            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="phone">Phone Number <span className='text-red-500'>*</span> </label>
              <input
                className={`${errors.phone === 'done' ? 'border-green-500 ' : errors.phone ? 'border-red-500 ' : ''} !border-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="phone"
                type="tel"
                placeholder="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleTyping}
                required
              />
              {errors.phone === 'done' && <AiOutlineCheck className="absolute right-3 top-10 text-green-500" />}
              {errors.phone && errors.phone !== 'done' && <>
                <p className="text-red-500 text-xs italic">{errors.phone}</p>
              </>}

            </div>
            <div className='footer w-full flex justify-end mt-3'>
              {tableLoading ?
                <button disabled type='button' className='flex items-center bg-green-600 text-slate-100 px-4 py-3 sm:px-3 sm:py-2 hover:bg-green-800 focus:ring-4 focus:ring-green-300 me-3'>
                  <VscLoading className='animate-spin' size={23} />
                  <span className='ps-2'>Loading...</span>
                </button>
                :
                <button type='submit' className='flex items-center bg-green-600 text-slate-100 px-4 py-3 sm:px-3 sm:py-2 hover:bg-green-800 focus:ring-4 focus:ring-green-300 me-3'>
                  {modalMode === modes.add ? <>
                    <span className='ps-2'>Add</span>
                    <IoIosAdd size={23} /></> :
                    <>
                      <span className='ps-2'>Save</span>
                      <LiaUserEditSolid size={23} />
                    </>
                  }

                </button>
              }
              <button type='button' onClick={closeDataModal} className='flex items-center bg-gray-600 text-slate-100 px-4 py-3 sm:px-5 sm:py-2 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300'>
                Close
              </button>

            </div>
          </form>

        </Modal>

        {/* Remove Modal */}
        <Modal
          open={openRemoveModal} onClose={closeRemoveModal} center closeOnOverlayClick={false} animationDuration={100}
          classNames={{ modal: 'md:!w-dvw !text-slate-900 !bg-gray-100 dark:!bg-slate-800 dark:!text-white' }}
          closeIcon={<IoCloseCircleSharp size={25} className='hover:text-sky-500' />}
        >
          <h2 className='text-2xl mb-2'>{deleteModalMode === modes.singleDelete ? `Remove ${currentDelete?.firstName} ${currentDelete?.lastName}` : 'Delete Many'}</h2>
          <p className='text-lg'>Are you Sure?</p>
          <div className='w-full flex justify-end mt-3'>
            {tableLoading ?
              <button disabled type='button' className='flex items-center bg-red-600 text-slate-100 px-4 py-3 sm:px-3 sm:py-2 hover:bg-red-800 focus:ring-4 focus:ring-red-300 me-3'>
                <VscLoading className='animate-spin' size={23} />
                <span className='ps-2'>Loading...</span>
              </button>
              :
              <button onClick={deleteModalMode === modes.singleDelete ? deleteStudent : deleteMany} className='flex items-center bg-red-600 text-slate-100 px-4 py-3 sm:px-3 sm:py-2 hover:bg-red-800 focus:ring-4 focus:ring-red-300 me-3'>
                <span className='ps-2'>Delete</span>
                <MdDelete size={23} />
              </button>
            }
            <button type='button' onClick={closeRemoveModal} className='flex items-center bg-gray-600 text-slate-100 px-4 py-3 sm:px-5 sm:py-2 hover:bg-gray-700 focus:ring-4 focus:ring-gray-300'>
              Close
            </button>

          </div>


        </Modal>

      </main >
    </div >
  </>
}

export default App;
