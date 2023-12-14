import React from 'react'

function CheckClient() {
  return (
    <div className=' d-flex justify-content-center align-items-center vh-100  flex-column' >
      <h3> New client <a href="/ClientProfile">click here</a></h3> 
      <h3>  Existing Customer  <a href="/invoice">click here</a></h3> 
    </div>
  )
}

export default CheckClient