import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import AuraSlogan from "../../assets/AuraSlogan.png";
import "./Header.css";

function Header({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [show, setShow] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    e.stopPropagation();
    setShow(!show);
  };

  return (
    <div className="header-container">
      <img
        src={AuraSlogan}
        alt="Aura Slogan"
        onClick={handleIconClick}
        className="header-logo"
      />

      {/* {show && (
        <ul className="header-links" ref={dropdownRef}>
          <NavLink exact to="/" onClick={() => setShow(false)}>
            Home
          </NavLink>

          <NavLink exact to="/notes" onClick={() => setShow(false)}>
            Notes
          </NavLink>

          <NavLink exact to="/reminders" onClick={() => setShow(false)}>
            Reminders
          </NavLink>
        </ul>
      )} */}

      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </div>
  );
}

export default Header;
