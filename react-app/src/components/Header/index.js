import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import AuraSlogan from "../../assets/AuraSlogan.png";
import "./Header.css";

const Header = ({ isLoaded }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [secondaryDropdownContent, setSecondaryDropdownContent] = useState([]);
  const sessionUser = useSelector((state) => state.session.user);

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSecondaryDropdownShow = (content) => {
    setSecondaryDropdownContent(content);
  };

  const handleSecondaryDropdownRemove = () => {
    setSecondaryDropdownContent([]);
  };

  return (
    <header className="header-container">
      <div className="header-element">
        <img src={AuraSlogan} alt="Logo" className="header-logo" />
      </div>
      <div className="header-element">
        <div
          className="header-dropdown"
          onClick={handleDropdownToggle}
          onMouseEnter={handleSecondaryDropdownRemove}
        >
          <h2>Voice Commands</h2>
          {showDropdown && (
            <div className="dropdown-content">
              <p
                onMouseEnter={() =>
                  handleSecondaryDropdownShow([
                    "Ask a question: 'Aura, (...question)' : 'Answer'",
                    "Ignore a question: 'Ignore' : 'OK will do'",
                    "Stop Voice: 'Stop listening' : 'Goodbye'",
                    "Brief Summary: 'What can you do' : 'Summary'",
                    "Using Origin: 'origin' : 'Replaces origin with origin address'",
                    "Using Destination: 'destination' : 'Replaces destination with destination address'",
                  ])
                }
              >
                Conversation
              </p>
              <p
                onMouseEnter={() =>
                  handleSecondaryDropdownShow([
                    "Ask a question: 'Aura, (...question)' : 'Response'",
                    "Ignore a question: 'Ignore' : 'OK will do'",
                    "Stop Voice: 'Stop listening' : 'Goodbye'",
                    "Brief Summary: 'What can you do' : 'Summary'",
                  ])
                }
              >
                Reminder Calendar
              </p>
              <p
                onMouseEnter={() =>
                  handleSecondaryDropdownShow([
                    "Set Starting Location: 'Set origin to (...address)' : 'Origin set to (address)'",
                    "Set Destination: 'Set destination to (...address)' : 'Destination set to (address)'",
                    "Check Origin: 'Where is origin' : 'Origin is (value)'",
                    "Check Destination: 'Where is destination' : 'Destination is (value)'",
                    "Find Route From Origin To Destination: 'Find route' : 'Route determined'",
                    "Time To Drive To Destination: 'Route duration' : 'It will take (duration)'",
                    "Distance To Drive To Destination: 'Route distance' : 'The destination is (distanceAway) away'",
                  ])
                }
              >
                Google Map
              </p>
              <p onMouseEnter={() => handleSecondaryDropdownShow(["testing"])}>
                Note
              </p>
              <p
                onMouseEnter={() =>
                  handleSecondaryDropdownShow([
                    "Ask a question: 'Aura, (...question)' : 'Response'",
                    "Ignore a question: 'Ignore' : 'OK will do'",
                    "Stop Voice: 'Stop listening' : 'Goodbye'",
                    "Brief Summary: 'What can you do' : 'Summary'",
                  ])
                }
              >
                Alarm Clock
              </p>
            </div>
          )}
          {showDropdown && secondaryDropdownContent.length > 0 && (
            <div className="secondary-dropdown">
              <p className="secondary-dropdown-header">
                <p className="secondary-dropdown-header">Action:</p>
                Prompt → Response
              </p>
              {secondaryDropdownContent.map((option, index) => (
                <div key={index}>
                  <p className="secondary-dropdown-prompt">
                    {`${option.split(":")[0]} :`}
                  </p>
                  <p>{`${option.split(":")[1]} → ${option.split(":")[2]}`}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="header-element">
        <div className="header-dropdown" onClick={handleDropdownToggle}>
          <h2>Get Inspiration</h2>
          {showDropdown && (
            <div className="dropdown-content">
              <p>Testing</p>
              <p>Testing</p>
              <p>Testing</p>
              <p>Testing</p>
            </div>
          )}
        </div>
      </div>
      <div className="header-element">
        <div className="header-dropdown" onClick={handleDropdownToggle}>
          <h2>Limitations</h2>
          {showDropdown && (
            <div className="dropdown-content">
              <p>Testing</p>
              <p>Testing</p>
              <p>Testing</p>
              <p>Testing</p>
            </div>
          )}
        </div>
      </div>
      <div className="header-element">
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </header>
  );
};

export default Header;
