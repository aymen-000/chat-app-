import React from 'react'

function Avatar({id , userName}) {
    const colors = [
        'bg-blue-300',
        'bg-green-300',
        'bg-indigo-300',
        'bg-purple-300',
        'bg-pink-300',
        'bg-red-300',
        'bg-yellow-300',
        'bg-teal-300',
        'bg-orange-300',
    ];
    const intId = parseInt(id )
    const value = intId % colors.length
    const classN  = colors[value] + ' rounded-full w-20 h-25'
  return (
    <div className={colors[value] + ' rounded-full w-10 h-10 justify-center items-center content-center flex'}>
        {userName[0]}
    </div>
  )
}

export default Avatar