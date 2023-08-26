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
            <div className="dropdown-content" style={{ width: "100%" }}>
              <p
                onMouseEnter={() =>
                  handleSecondaryDropdownShow([
                    "Ask a question: 'hey Aura, (...question)' : 'Answer'",
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
                    "Set New Reminder/Alarm(Limited to today): 'Set reminder to (description) at (time) from (location)' : 'Reminder set to (description) at (time) from (location)'",
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
                    "Distance To Drive To Destination: 'Route distance' : 'The destination is (distance) away'",
                  ])
                }
              >
                Google Map
              </p>
              <p
                onMouseEnter={() =>
                  handleSecondaryDropdownShow([
                    "Voice interaction with notes: '(Content dictation through mic button only)' : '(No response)'",
                  ])
                }
              >
                Note
              </p>
              <p
                onMouseEnter={() =>
                  handleSecondaryDropdownShow([
                    "Current Time: 'The current time' : 'The current time is (Time)'",
                    "Current Date: 'The current date' : 'The current date is (Date)'",
                    "Next Alarm: 'When is my next alarm?' : 'You next alarm is (alarm time)'",
                  ])
                }
              >
                Alarm Clock
              </p>
            </div>
          )}
          {showDropdown && secondaryDropdownContent.length > 0 && (
            <div className="secondary-dropdown">
              <p className="secondary-dropdown-header">Action:</p>
              Prompt → Response
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
            <div className="dropdown-content" style={{ width: "200%" }}>
              <div className="header-dropdown-block">
                <h4>Language Translation</h4>
                <p>
                  Initial Prompt: I want you to act as a japanese translator
                  that only responds back the english translation
                </p>
                <p>User: Ohayo gozaimasu </p>
                <p>Aura: Good morning.</p>
              </div>
              <div className="header-dropdown-block">
                <h4>StoryTelling Companion</h4>
                <p>
                  Initial Prompt: I want you to help me write a story. I'll
                  share the beginning of a story, and you will help develop it
                  further by adding details, characters, or plot twists.
                </p>
                <p>
                  User: A boy is playing a new monster collecting game and he
                  witnessed a new undiscovered evolution path
                </p>
                <p>
                  Aura: Exciting! Let's build on that beginning. Here's the next
                  part of the story: As the boy immersed himself in the world of
                  the monster collecting game, his eyes widened with
                  astonishment. He had been playing the game for weeks,
                  capturing and training various creatures, but nothing could
                  have prepared him for what he was about to witness.
                </p>
              </div>
              <div className="header-dropdown-block">
                <h4>Hiring Manager</h4>
                <p>
                  Initial Prompt: I want you to act as a hiring manager and ask
                  me 1 mock interview question for SWE everytime i say
                  "question", otherwise i want you to give me feedback on the
                  response to the question you asked and how to improve
                </p>
                <p>User: Question</p>
                <p>Aura: Certainly! Here's a question for you: Question</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="header-element">
        <div className="header-dropdown" onClick={handleDropdownToggle}>
          <h2>Limitations</h2>
          {showDropdown && (
            <div
              className="dropdown-content"
              style={{
                width: "200%",
              }}
            >
              <div className="header-dropdown-block">
                <p>
                  With an AI chatbot, There are a few limitations. These
                  include:
                  <p>
                    1. Relies solely on text communication and cannot process or
                    understand complex visual or audio inputs.
                  </p>
                  2. Only as reliable as the information I have been programmed
                  with and may not always have access to up-to-date or accurate
                  data.
                  <p>
                    3. Cannot experience emotions or understand the full context
                    or nuances of human interactions.
                  </p>
                  <p>
                    4. May not be able to understand or respond appropriately to
                    ambiguous or multi-layered questions.
                  </p>
                  <p>
                    5. Does not have true consciousness or self-awareness and
                    can only execute predetermined tasks based on predefined
                    algorithms. Please note that these limitations may vary
                    depending on the specific chatbot implementation.
                  </p>
                </p>
              </div>
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
