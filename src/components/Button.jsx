import React from 'react'

const Button = ({label, onClick}) => {
  return (
    <button className="btn btn-primary bg-green-500 hover:bg-green-600 text-white h-6 rounded" onClick={onClick}>{label}</button>
  )
}

export default Button