import React from 'react'
import { Link } from 'react-router-dom'

function CheckClient() {
  return (
    <div className=' d-flex justify-content-center align-items-center vh-100  flex-column' >
      <h3> New client <Link to="/ClientProfile" >click here</Link></h3> 
      <h3>  Existing Customer <Link to="/invoice">click here</Link></h3> 
    </div>
  )
}

export default CheckClient