import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Header ({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if DOM element rendered && event.target(click) is not contained in DOM element setShow(false)
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleIconClick = (e) => {
    // click event was propagating to document, preventing dropdown from opening
    e.stopPropagation();
    setShow(!show);
  };

  return (
    <ul className="header-container">
      <FontAwesomeIcon
        icon={faBars}
        className="header-icon"
        onClick={handleIconClick}
      />

      {show ? (
        <ul className="header-links" ref={dropdownRef}>
          <div>
            <NavLink exact to="/">
              Home
            </NavLink>
          </div>
          {/* <div>
            <NavLink exact to="/messages">
              Messages
            </NavLink>
          </div> */}
          <div>
            <NavLink exact to="/notes">
              Notes
            </NavLink>
          </div>
          <div>
            <NavLink exact to="/reminders">
              Reminders
            </NavLink>
          </div>
          {/* <div>
            <NavLink exact to="/alarms">
              Alarms
            </NavLink>
          </div>
          <div>
            <NavLink exact to="/testing">
              Testing
            </NavLink>
          </div> */}
        </ul>
      ) : (
        ""
      )}
      {/* <div className="nav-display-text">
        <div id="ai-display-text"></div>
        <div id="user-display-text"></div>
      </div> */}
      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </ul>
  );
}

export default Header;