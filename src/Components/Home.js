import React from 'react'
import { Link } from 'react-router-dom'
function Home() {

  return (
    <div className='d-flex justify-content-center align-items-center vh-100  flex-column'>
    <h1>Click Here To Create The New Invoice</h1>
    <h1><Link to="/checkclient" className="nav-link text-primary">
                  New Invoice
                </Link></h1>
    </div>
  )
}

export default Home