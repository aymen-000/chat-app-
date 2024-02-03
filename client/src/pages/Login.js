import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const {setUserName , setExist , userName , setId , id} = useContext(UserContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err , setErr ] = useState('')
  const [data , setData] = useState([])
  const navigate = useNavigate()
  const Submit = (e) => {
    e.preventDefault()
    setErr('')
    if (username && password ){
      axios.post('/login', {userName: username , password : password}).then((result)=>{
        setData(result.data)
        console.log('data: ')
        console.log(result.data)
        if (result.data != 'wrong pass' && result.data != 'not found'){
          setUserName(result.data.userName)
          setId(result.data._id)
          setExist(true)
          navigate('/profile')
        }else {
          navigate('/')
        }

      }).catch((err)=>{
        console.log(err.message)
      })
    }else {
      setErr('somthing missing')
    }
    
  }
  console.log(data)
  console.log(userName)
  console.log(id)
  return (
    <div className='bg-gradient-to-r from-gray-200 to-gray-300 flex justify-center items-center h-screen ' >
      <div  >
        <form onSubmit={(e) => { Submit(e) }}>
          <div className='space-y-1 flex-col mb-7 ' >
            <h1 className='items-center text-center text-2xl font-bold mb-2 '>Login</h1>
            <div>
              <input placeholder='userName' value={username} onChange={(e) => { setUsername(e.target.value) }} className='py-2 px-2 border-2  w-[290px]  rounded-lg' />
            </div>
            <div>
              <input placeholder='Password' value={password} onChange={(e) => { setPassword(e.target.value) }} className='py-2 px-2 border-2  w-[290px]   rounded-lg' />
            </div>
            <div>
              <button className='py-2 px-2  bg-gradient-to-r from-cyan-500 to-blue-500  hover:bg-gradient-to-r hover:from-cyan-300 hover:to-blue-300 rounded-lg  transition-transform  w-[290px] text-white font-bold '>Register</button>
            </div>
            <div className='mt-3 text-gray-700'>
              You Don't Have An Acount ? <Link to={"/register"} className='text-sky-800'> Login</Link>
            </div>
            <div className='text-center text-red-700'>{err == "somthing missing" && <p>Please Fill All The Information</p>}</div>
            <div className='text-center text-red-700'>{(data == "wrong pass" || data== 'not found') && <p>Please Enter your correct Information</p>}</div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login