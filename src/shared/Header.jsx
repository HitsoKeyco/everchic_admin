import { NavLink, useNavigate } from "react-router-dom";
import './css/Header.css'
import { useState } from "react";
import { setUserThunk } from "../store/slices/user.slice";
import { useDispatch } from "react-redux";
import navLinks from "../utils/navLinks";


const Header = ({ }) => {
  const [isHandleMenu, setIsHandleMenu] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleExit = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setIsHandleMenu(false)
    dispatch(setUserThunk(false))
    navigate('/login')
  }
  const routes = navLinks()
  return (
    <>
      <div className="header_container_nav_mobile">
        <ul className="header_nav_elements">
          <li><NavLink to='/' className='header_link' >EVERCHIC</NavLink></li>
          <li onClick={() => setIsHandleMenu(true)}><i className='bx bx-menu header_menu'></i></li>
        </ul>
      </div>
      {
        isHandleMenu &&
        <div className="header_container">
          <i className='bx bx-x header_close_menu' onClick={() => setIsHandleMenu(false)}></i>
          <ul className='header_ul_link_container'>
            {
              routes.map((route, index) => (
                <li key={index}>
                  <NavLink
                    to={route.to}
                    className='header_link header_menu'
                    onClick={() => setIsHandleMenu(false)}
                  >
                    {route.text}
                  </NavLink>
                </li>
              ))
            }
          </ul>
          <i className='bx bxs-log-out header_logout' onClick={handleExit}></i>
        </div >
      }
    </>
  );
}

export default Header;
