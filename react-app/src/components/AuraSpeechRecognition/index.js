import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postMessage } from "../../store/message";
import { getConversations } from "../../store/conversation";
import "./AuraSpeechRecognition.css";
import ProgressBar from "../ProgressBar";
import { postReminder } from "../../store/reminder";
import dayjs from "dayjs";

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#html_and_css_2
export default function AuraSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const [diagnosticText, setDiagnosticText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const synth = window.speechSynthesis;

  const handleVoiceChange = (value) => {
    const selected = voices.find((voice) => voice.name === value);
    setSelectedVoice(selected);
  };

  function extractReminderDetails(phrase) {
    const descriptionStartIndex =
      phrase.indexOf("set reminder to ") + "set reminder to ".length;
    const descriptionEndIndex = phrase.indexOf(" at ");

    const timeStartIndex = descriptionEndIndex + " at ".length;
    const timeEndIndex = phrase.lastIndexOf(" from ");

    const locationStartIndex = timeEndIndex + " from ".length;

    const description = phrase.substring(
      descriptionStartIndex,
      descriptionEndIndex
    );
    const time = phrase.substring(timeStartIndex, timeEndIndex);
    const location = phrase.substring(locationStartIndex);

    const currentDate = dayjs().format("YYYY-MM-DD");
    const dateTimeFormatted = `${currentDate} ${time}`;

    const [datePart, timePart, amOrPm] = dateTimeFormatted.split(" ");
    const [year, month, day] = datePart.split("-");
    let [hours, minutes] = timePart.split(":");

    if (amOrPm === "p.m.") {
      hours = parseInt(hours) === 12 ? 12 : parseInt(hours) + 12;
    } else if (amOrPm === "a.m." && hours === "12") {
      hours = 0;
    }

    const dateTimeObject = new Date(year, month - 1, day, hours, minutes);

    let dateTime = dayjs(dateTimeObject).format("YYYY-MM-DD HH:mm:ss");

    return {
      description,
      date_time: dateTime,
      location,
    };
  }

  useEffect(() => {
    const populateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      const defaultVoice = availableVoices.find(
        // (voice) => voice.name === "Google UK English Female"
        (voice) => voice.name.includes("Microsoft Zira")
      );
      setSelectedVoice(defaultVoice);
    };

    // Add event listener to update voices when they change
    synth.addEventListener("voiceschanged", populateVoices);

    // Populate voices on component mount
    populateVoices();

    // Clean up event listener on component unmount
    return () => {
      synth.removeEventListener("voiceschanged", populateVoices);
    };
  }, []);

  useEffect(() => {
    getConversations();
  }, [dispatch]);

  const auraStart = async (e) => {
    e.preventDefault();

    // create new SpeechRecognition and SpeechGrammarList instances
    const aura = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    setActive(true);

    const keyWords = ["stop listening", "Aura", "aura", "ignore"];

    // Grammar - separated by semi-colons
    // 1: states the format and version used. This always needs to be included first. i.e #JSGF V1.0;
    // 2: The second line indicates a type of term that we want to recognize. public declares that it is a public rule,
    //    the string in angle brackets defines the recognized name for this term (keyword), and the list of items that
    //    follow the equals sign are the alternative values that will be recognized and accepted as appropriate values
    //    for the term. Note how each is separated by a pipe character.
    const grammar = `#JSGF V1.0; grammar keyWords; public <keyWord> = ${keyWords.join(
      " | "
    )};`;

    // This accepts as parameters the string we want to add, plus optionally a weight value that specifies the importance
    // of this grammar in relation of other grammars available in the list (can be from 0 to 1 inclusive.)
    speechRecognitionList.addFromString(grammar, 1);

    // Methods available to SpeechRecognition class
    aura.grammars = speechRecognitionList;
    aura.continuous = true;
    aura.lang = "en-US";
    aura.interimResults = false;
    aura.maxAlternatives = 1;

    let timeout;

    aura.start();

    // results event returns SpeechRecognitionResultList object containing SpeechRecognitionResult objects
    // it has a getter enabling list/array access
    // SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual recognized words.
    // We then return its transcript property to get a string containing the individual recognized result as a string,

    // const result = event.results;

    const date = new Date();

    let aiSpeaking = document.getElementById("ai-display-text");
    // let speaking = document.getElementById("user-display-text");
    let alarmTime = document.getElementById("alarm-time");
    let alarmSetButton = document.getElementById("alarm-set");
    const conversationIdElement = document.getElementById("set-conversation");
    const originInput = document.getElementById("origin-input");
    const destinationInput = document.getElementById("destination-input");
    const findRouteButton = document.getElementById("find-route-button");
    const distance = document.getElementById("distance");
    const duration = document.getElementById("duration");

    let conversationId;
    if (conversationIdElement) {
      conversationId = conversationIdElement.getAttribute(
        "data-conversation-id"
      );
    }

    function displayText(text) {
      let index = 0;
      let delay = 50;
      aiSpeaking.textContent = "";
      function typeNextCharacter() {
        if (index < text.length) {
          const currentCharacter = text.charAt(index);
          if (currentCharacter === " ") {
            // innerText wasn't adding whitespace as intended, resolved with textContent
            aiSpeaking.textContent += " ";
          } else {
            aiSpeaking.textContent += currentCharacter;
          }
          index++;
          setTimeout(typeNextCharacter, delay);
        }
      }
      typeNextCharacter();
    }

    const speak = (spoken) => {
      // was preventing ai_response
      if (synth.speaking) {
        return;
      }

      // speak text
      if (!currentUser) {
        const speakText = new SpeechSynthesisUtterance(spoken);
        speakText.voice = selectedVoice;
        aura.abort();
      }

      if (spoken !== "") {
        const speakText = new SpeechSynthesisUtterance(spoken);

        speakText.voice = selectedVoice;

        // speak end
        speakText.onend = (e) => {
          console.log("Done Speaking");
        };
        // speak error
        speakText.onerror = (e) => {
          console.error("Something went wrong");
        };

        // set rate and pitch
        speakText.rate = 1.2;
        speakText.pitch = 1;

        // speak
        synth.speak(speakText);
        if (spoken === "Goodbye") {
          spoken = "";
        }
        displayText(spoken);
      }
    };

    const processResult = (spoken) => {
      const conversation = {
        conversation_id: conversationId,
        message: "",
      };

      if (!currentUser) {
        speak("Please log in to get started");
      } else if (spoken.includes("hello")) {
        speak("Hi! How can I assist you?");
      } else if (spoken.includes("stop listening")) {
        speak("Goodbye");
        aura.stop();
      } else if (spoken.includes("ignore")) {
        clearTimeout(timeout);
        speak("Ok will do");
        spoken = "";
      } else if (spoken.includes("what can you do")) {
        speak(
          "I can help you with various tasks such as providing information, answering questions, setting reminders, giving recommendations, and more. Feel free to ask me anything!"
        );
      } else if (spoken.includes("the current time")) {
        speak(`the current time is ${new Date().toLocaleTimeString()}`);
      } else if (spoken.includes("the current date")) {
        const formattedDate = date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        speak(`the current date is ${formattedDate}`);
      } else if (spoken.includes("when is my next alarm")) {
        if (alarmTime.value) {
          speak(`your next alarm is ${alarmTime.value}`);
        } else {
          speak("No alarms currently set");
        }
      } else if (spoken.includes("set reminder to ")) {
        const { description, date_time, location } =
          extractReminderDetails(spoken);

        dispatch(
          postReminder({
            description: description,
            date_time: date_time,
            location: location,
            title: "Voice Reminder",
          })
        );
      } else if (spoken.includes("set origin to")) {
        let newOrigin = spoken.split("origin to")[1];
        originInput.value = newOrigin;
        speak(`origin set to ${originInput.value}`);
      } else if (spoken.includes("where is origin")) {
        speak(
          `Origin is ${
            originInput.value === "" ? "no origin set" : originInput.value
          }`
        );
      } else if (spoken.includes("where is destination")) {
        speak(
          `Destination is ${
            destinationInput.value === ""
              ? "no destination set"
              : destinationInput.value
          }`
        );
      } else if (spoken.includes("set destination to")) {
        let newDestination = spoken.split("destination to")[1];
        destinationInput.value = newDestination;
        speak(`destination set to ${destinationInput.value}`);
      } else if (spoken.includes("find route")) {
        findRouteButton.click();
        speak(`Route determined`);
      } else if (spoken.includes("route duration")) {
        let routeDuration = duration.innerText.split("Duration: ")[1];
        if (routeDuration === undefined) {
          speak("No route found");
        } else {
          speak(`It will take ${routeDuration}`);
        }
      } else if (spoken.includes("route distance")) {
        let distanceAway = distance.innerText.split("Distance: ")[1];
        if (distanceAway === undefined) {
          speak("No route found");
        } else {
          speak(`The destination is ${distanceAway} away`);
        }
      } else if (spoken.includes("hey Aura") || spoken.includes("hey Ora")) {
        let modifiedSpoken;
        let newMessage;
        if (!conversationId) {
          speak("Please choose a conversation to send a message");
        }

        if (spoken.includes("origin")) {
          if (originInput.value === "undefined" || !originInput.value) {
            speak("No origin set");
            return;
          } else {
            modifiedSpoken = spoken.replace("origin", originInput.value);
          }
        } else if (spoken.includes("destination")) {
          if (
            destinationInput.value === "undefined" ||
            !destinationInput?.value
          ) {
            speak("No destination set");
            return;
          } else {
            modifiedSpoken = spoken.replace(
              "destination",
              destinationInput.value
            );
          }
        } else {
          modifiedSpoken = spoken;
        }

        if (modifiedSpoken.includes("Ora")) {
          modifiedSpoken = modifiedSpoken.split("Ora")[1];
        } else if (modifiedSpoken.includes("Aura")) {
          modifiedSpoken = modifiedSpoken.split("Aura")[1];
        }

        conversation.message = modifiedSpoken;
        console.log(modifiedSpoken);
        // dispatch(postMessage(conversation)).then((result) => {
        //   if (result) {
        //     speak(result.ai_response);
        //   }
        // });
        const postMessagePromise = dispatch(postMessage(conversation));

        setLoading(true);
        postMessagePromise
          .then((data) => {
            setLoading(false);
            speak(data.ai_response);
          })
          .catch((error) => {
            setErrors(error);
            setLoading(false);
          });
      }
    };

    // We also use the speechend event to stop the speech recognition service from running
    // (using SpeechRecognition.stop()) after delay and it has finished being spoken:
    aura.onspeechend = () => {
      clearTimeout(timeout);
      setActive(false);
      speak("Goodbye");
      let speaking = document.getElementById("user-display-text");
      if (speaking) {
        speaking.innerText = "User";
      }
      let aiSpeaking = document.getElementById("ai-display-text");
      if (aiSpeaking) {
        aiSpeaking.innerText = "Aura";
      }
    };

    aura.onnomatch = (event) => {
      setDiagnosticText("I didn't recognize that.");
      setActive(false);
      setLoading(false);
      return () => {
        aura.abort();
      };
    };

    aura.onerror = (event) => {
      setDiagnosticText(`Error occurred in recognition: ${event.error}`);
      setActive(false);
      setLoading(false);
      return () => {
        aura.abort();
      };
    };

    // let firstWord;
    aura.onresult = (event) => {
      for (let i = 0; i < event.results.length; i++) {
        let spoken = event.results[i][0].transcript;

        // clear previous timeout
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          processResult(spoken);
        }, 1500);
      }
    };

    return () => {
      aura.abort();
      let speaking = document.getElementById("user-display-text");
      if (speaking) {
        speaking.innerText = "User";
      }
      let aiSpeaking = document.getElementById("ai-display-text");
      if (aiSpeaking) {
        aiSpeaking.innerText = "Aura";
      }
    };
  };

  useEffect(() => {}, [dispatch]);

  return currentUser && !loading ? (
    <div className="aura-container">
      <button
        disabled={active}
        title="start aura"
        className="conversation-button"
        id={`aura-button-${active}`}
        onClick={auraStart}
      >
        Voice
      </button>

      <select
        id="voice-select"
        title="choose voice"
        className="conversation-button"
        onChange={(e) => handleVoiceChange(e.target.value)}
      >
        <option className="voice-select-default" value="default">
          Select Voice
        </option>
        {voices.map((voice, index) => (
          <option
            key={index}
            value={voice.name}
            className="voice-select-options"
          >
            {voice.name} / {voice.lang}
          </option>
        ))}
      </select>

      <p
        id="diagnostic"
        className="diagnostic-text"
        onClick={(e) => setDiagnosticText((e.target.value = ""))}
      >
        {diagnosticText}
      </p>
    </div>
  ) : (
    currentUser && loading && <ProgressBar />
  );
}
