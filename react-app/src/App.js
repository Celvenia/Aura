import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "./store/session";
import AuraSpeechRecognition from "./components/AuraSpeechRecognition";
import Header from "./components/Header";
import Conversation from "./components/Conversation";
import Calendar from "./components/Calendar";
import Notes from "./components/Notes";
import Clock from "./components/Clock";
// import GoogleMap from "./components/GoogleMap";
import AuraSlogan from "./assets/AuraSlogan.png"

const App = () => {
  const [selectedComponent, setSelectedComponent] = useState("conversation");
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user)
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const componentMap = {
    conversation: <Conversation />,
    calendar: <Calendar />,
    notes: <Notes />,
    clock: <Clock />,
    // googleMap: <GoogleMap />,
  };

  return (
    <Router>
      <div className="app-container">
        <div className="sidebar">
          {/* Sidebar content */}
          <img src={AuraSlogan} />
        </div>
        <div className="main-content">
        <Header isLoaded={isLoaded}
          />
          <div className="grid-container">
            <div className="grid-item-double">{componentMap.conversation}</div>
            <div className="grid-item">{componentMap.calendar}</div>
            <div className="grid-item">{componentMap.notes}</div>
            <div className="grid-item">{componentMap.clock}</div>
            <div className="grid-item">{/* Empty grid item */}</div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
