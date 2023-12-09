import React from 'react'
import NavBarButton from '../NavBarButton/NavBarButton'
import './Navbar.scss'

export default Navbar = () => {
    return (
      <div className='navbar'>
        <div className='left-section'>
          <NavBarButton/>
        </div>
        <div className='right-section'>Right</div>
      </div>
    )
}