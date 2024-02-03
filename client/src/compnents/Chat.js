import React, { useEffect, useState } from 'react'
import { IoSendOutline } from "react-icons/io5"
import Avatar from './Avatar'
import { BsChatHeart } from "react-icons/bs"
import { UserContext } from '../UserContext'
import { useContext } from 'react'
import { FaUserCircle } from "react-icons/fa"
import { IoLogInOutline } from "react-icons/io5";
import { FaArrowCircleLeft } from "react-icons/fa"
import axios from 'axios'
import {useNavigate}from "react-router-dom"
import { MdOutlineAttachFile } from "react-icons/md"
function Chat() {
    const {id , userName , setExist , setUserName ,exist} = useContext(UserContext)
    const [newMessage , setNewMessage] = useState("")
    const [wss  ,setWss] = useState(null)
    const [oldMessages , setOldMessages] = useState([])
    const [online , setOnline] = useState({})
    const [myMessages , setMyMessages] = useState([])
    const [oldData  , setOldData] = useState([])
    const [selected , setSelected] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        const ws = new WebSocket('ws://localhost:5000')
        setWss(ws)
        ws.addEventListener("message", (e)=>{
            const online = JSON.parse(e.data)['online'] 
            const onlinePeople = {}
            online?.forEach(item => {
                    onlinePeople[item.userId] = item.userName
                }
            )
            if ("online" in JSON.parse(e.data)) {
                setOnline(onlinePeople)
            }else {
                const data = JSON.parse(e.data)['text']
                const rec = JSON.parse(e.data)['rec']
                const sender = JSON.parse(e.data)['sender']
                const file = JSON.parse(e.data)['file']
                setOldMessages(prev => [...prev, {isour:false,text : data , sender : sender , rec : rec , file :file }])
                
            }
        })
    },[exist])

    const [selectedUserId , setSelectedUserId] = useState('')
    const selectPerson = (e, key) => {
        setSelectedUserId(key)
        setSelected(true)
    }
    const sendMessage = (e , file =null)=>{
        if(e) e.preventDefault()
        wss.send(JSON.stringify({
            message :{
                rec :selectedUserId , 
                sender : id , 
                text : newMessage ,
                file,
            }
        }))
        setOldMessages(prev => [...prev , {isour : true , text : newMessage , sender: id , rec : selectedUserId , file :file?.name}])
       
    }
    useEffect(()=>{
        if (selectedUserId) {
            axios.get('/getMessages/'+ selectedUserId).then((result)=>{
               setOldData(result.data)

            }).catch((err)=>{
                console.log(err.message)
            })
        }
    } , [selectedUserId, oldMessages , newMessage])
    const LogOut = (e)=>{
        axios.post("/logout" , {}).then((result)=>{
            setExist(false)
            setUserName(null)
            wss.close()
            navigate('/')
            
        }).catch((err)=>{
            console.log(err.message)
        })
    }
    const uploadFile =(e)=>{
        console.log(e.target.files[0])
        const fileReader = new FileReader()
        fileReader.readAsDataURL(e.target.files[0])
        fileReader.onload = ()=>{
            sendMessage(null , {
                name : e.target.files[0]?.name,
                data : fileReader.result,
            })
        }
        
    }
  return (
    <div className='flex min-h-screen  '>
        <div className={selected ==true ? " bg-gray-800 w-1/3 items-center space-y-3 p-3 max-sm:w-full max-sm:hidden" : "bg-gray-800 w-1/3 items-center space-y-3 p-3 max-sm:w-full max-sm:block"}>
            <div className='flex space-x-2 items-center justify-between '>
                <div className='flex space-x-2 items-center justify-between '>
                    <div className='text-white text-2xl'><FaUserCircle/></div>
                    <div><h1 className='text-white text-2xl '>{userName}</h1></div>
                </div>
                <div>
                    <div>
                        <IoLogInOutline onClick={(e)=>{LogOut(e)}} className='text-4xl text-white cursor-pointer hover:shadow-sm items-center'/>
                    </div>
                </div>
            </div>
            <div className='flex items-center space-x-2'>
                <BsChatHeart className='text-white'/>
                <h1 className='text-white text-2xl font-bold'>LET'S chat  </h1>
            </div>
            {Object.entries(online).map(([key , value])=>{
                if (key != id) {
                    return <div onClick={(e)=>{selectPerson(e, key)}} className={(selectedUserId == key ? 'bg-gray-200 flex space-x-2 items-center hover:shadow-sm hover:bg-gray-100 cursor-pointer p-2 ' :'flex space-x-2 items-center hover:shadow-sm hover:bg-gray-100 cursor-pointer ')}>
                      {selectedUserId == key && <div className='w-1 h-12 bg-blue-500'></div>}
                    <div className='flex p-2 items-center space-x-2'>
                        <div><Avatar id={key} userName={value}/></div>
                        <div>{value}</div>
                    </div>
                    
                </div>
                }
            })}
        </div>
        <div className={selected ==true ? "bg-gradient-to-r from-blue-500 to-teal-400 flex  w-2/3 flex-col max-sm:w-full  " : "bg-gradient-to-r from-blue-500 to-teal-400 flex  w-2/3 flex-col max-sm:w-full  max-sm:hidden"}>
            <div className='flex-grow flex' >
                <div className={selected ==true ? 'bg-gray-300 p-2  justify-items-center items-center hover:cursor-pointer min-h-screen max-sm:flex hidden' : 'bg-gray-300 p-2  justify-items-center items-center hover:cursor-pointer min-h-screen hidden'} onClick={(e)=>{e.preventDefault(); setSelected(!selected)}}><FaArrowCircleLeft className='text-black items-center text-2xl'/></div>
                {!selectedUserId && <div className='flex h-full justify-center items-center flex-grow'><div className='text-gray-600 text-2xl '>&larr; No selected a person </div></div>}
                {!!selectedUserId  && <div className='w-full mx-auto' > {oldData.map((item)=>{
                    
                        return <div className={item.senderId == id ? "flex  justify-end" : "flex  justify-start"}>
                            {item.senderId == selectedUserId && item.recId == id? <div className='bg-gray-500 rounded-lg p-1 m-3  w-fit '>{item.messages.message} {item.file ? <div><a href={'http://localhost:5000/uploads/'+ item.file} >{item.file}</a></div> : ''} <div></div>  </div> : (item.recId==selectedUserId && item.senderId == id) ? <div className='bg-gray-200 m-3 p-1 rounded-lg  w-fit'>{item.messages.message} {console.log(item.file)}  {item.file ? <div><a href={'http://localhost:5000/uploads/'+ item.file} >{item.file}</a></div> : ''}</div> : <div></div>}
                        </div>
                    
                })} </div>}
            </div>
            <div>

                {selectedUserId && <form className='flex space-x-2 items-center p-3 ' onSubmit={(e)=>{sendMessage(e)}}>
                    <input placeholder='Enter Your Message' className='p-3 w-full focus:outline-none' onChange={(e)=>{
                        setNewMessage(e.target.value)}} value={newMessage}/>
                    <button className='bg-blue-600 p-2 rounded-full' onClick={(e)=>{sendMessage(e)}}>
                        <IoSendOutline className='text-2xl'/>
                    </button>
                    <label className='bg-blue-600 p-2 rounded-full  cursor-pointer'>
                        <MdOutlineAttachFile className='text-2xl'/>
                        <input type='file' className='hidden' onChange={(e)=>{uploadFile(e)}}></input>
                    </label>
                </form>}
            </div>
        </div>
    </div>
  )
}

export default Chat