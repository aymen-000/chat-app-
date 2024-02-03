import React from 'react'
import { UserContext } from '../UserContext'
import { useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Chat from '../compnents/Chat'
function Profile() {
    const {userName, setUserName , setExist , setId} = useContext(UserContext)
    const navigate = useNavigate()
    const logout = (e)=>{
        e.preventDefault()
        axios.get('/logout').then((result)=>{
            if(result.data == true) {
                setUserName(null)
                setExist(false)
                setId(null)
                navigate('/')
            }
        }).catch((err)=>{
            console.log(err.message)
        })
    }
  return (
    <div>
        <Chat/>
    </div>
  )
}

export default Profile