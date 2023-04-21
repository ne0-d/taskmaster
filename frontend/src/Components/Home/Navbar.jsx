import React from 'react'
import "./Navbar.css"
import logo from "../../img/navlogo.png";

const Navbar = () => {
  return (
    <div className="navbar">
        <div className="navbar-addAsset">
            <img src={logo} className='navbar-logo' alt="" />
        </div>
        <div className="navbar-profile">
            {/* <Link to="../asset-form">
                <img
                // onClick={() => setModalOpened(true)}
                src={addIcon}
                className="addIcon"
                alt="add asset"
                />
            </Link> */}
            <p>Welcome Neo</p>
            <button className="navbar-logout-button" onClick={()=>{
                localStorage.clear();
                window.location.reload(false); 
            }} >
                Logout
            </button>
        </div>
    </div>
  )
}

export default Navbar