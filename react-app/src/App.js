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
import GoogleMaps from "./components/GoogleMaps";
import LandingPage from "./components/LandingPage";

const App = () => {
  const [selectedComponent, setSelectedComponent] = useState("conversation");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const componentMap = {
    conversation: <Conversation />,
    calendar: <Calendar />,
    notes: <Notes />,
    clock: <Clock />,
    googleMap: <GoogleMaps />,
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Header isLoaded={isLoaded} />
        {currentUser ? (
          <div className="grid-container">
            <div className="grid-item-double">{componentMap.conversation}</div>
            <div className="grid-item">{componentMap.calendar}</div>
            <div className="grid-item">{componentMap.googleMap}</div>
            <div className="grid-item">{componentMap.notes}</div>
            <div className="grid-item">{componentMap.clock}</div>
          </div>
        ) : isLoaded ? (
          <LandingPage />
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default App;
