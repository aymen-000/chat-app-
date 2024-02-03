import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, redirect } from 'react-router-dom'

function Register() {
    const [username , setUsername] = useState('')
    const [password , setPassword] = useState('')
    const [confirmPassword , setConfirmPassword] = useState('')
    const [err , setErr] = useState('')
    const [res , setRes] = useState('')
    const Submit = (e)=>{
        e.preventDefault()
        setErr('')
        if (username && password && confirmPassword ) {
            if (confirmPassword == password ) {
                const data = {
                    userName : username , 
                    password : password 
                }
                axios.post("/register" , data).then((result)=>{
                    setRes(result.data)
                }).catch((err)=>{
                    console.log(err.message)
                })
            }else {
                setErr('not egal')
            }
        }else {
            setErr('somthing missing')
        }
    }
    const equal = (e)=> {
        console.log(e.target.value)
        if (e.target.value == password && e.target.value !== "")  {
            e.target.className = 'py-2 px-2 border-2   w-[290px]   rounded-lg border-green-600 focus:outline-none'
        }else {
            e.target.className = 'py-2 px-2 border-2   w-[290px]   rounded-lg border-red-600 focus:outline-none'
        }
    }
  return (
    <div className='bg-gradient-to-r from-gray-200 to-gray-300 flex justify-center items-center h-screen ' >
        <div  >
            <form onSubmit={(e)=>{Submit(e)}}>
                <div className='space-y-1 flex-col mb-7 ' >
                    <h1 className='items-center text-center text-2xl font-bold mb-2 '>Register</h1>
                    <div>
                        <input placeholder='userName' value={username} onChange={(e)=>{setUsername(e.target.value)}} className='py-2 px-2 border-2  w-[290px]  rounded-lg'/>
                    </div>
                    <div>
                        <input placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}} className='py-2 px-2 border-2  w-[290px]   rounded-lg'/>
                    </div>
                    <div>
                        <input placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>{ setConfirmPassword(e.target.value) ; equal(e)}} className='py-2 px-2 border-2   w-[290px]   rounded-lg focus:outline-none'/>
                    </div>
                    <div>
                        <button className='py-2 px-2  bg-gradient-to-r from-cyan-500 to-blue-500  hover:bg-gradient-to-r hover:from-cyan-300 hover:to-blue-300 rounded-lg  transition-transform  w-[290px] text-white font-bold '>Register</button>
                    </div>
                    <div className='mt-3 text-gray-700'>
                        You Allready Have An Acount ? <Link to={"/"} className='text-sky-800'> Loggin </Link>
                    </div>
                    <div className='text-center text-red-700'>{ res == "name deja exist " && <p>Name Exist Try with Another Name</p>}</div>
                    <div className='text-center text-red-700'>{ err == "somthing missing" && <p>Please Fill All The Information</p>}</div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Register