import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { useContext } from 'react'
export const UserContext = createContext({})
export function UserContextProvider({children}) {
    const [userName , setUserName] = useState(null)
    const [id  ,setId] = useState('')
    const [exist , setExist] = useState(false)
    useEffect (()=>{
        axios.get('/profile').then((result)=>{
            if (result.data != 'not logged') {
                setExist(true)
                setUserName(result.data.userName)
                setId(result.data.userId)
            }
        }).catch((err)=>{
            console.log(err.message)
        })
    }, [])
    return (
        <UserContext.Provider value={{userName , setUserName , id , setId , exist , setExist}}>{children}</UserContext.Provider>
    )
}