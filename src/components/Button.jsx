import React from 'react'

const Button = ({label, onClick}) => {
  return (
    <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors" onClick={onClick}>{label}</button>
  )
}

export default Button