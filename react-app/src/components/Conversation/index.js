import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversations,
  updateConversation,
  deleteConversation,
  postConversation,
} from "../../store/conversation";
import { getMessages, deleteMessages, postMessage } from "../../store/message";
import "./Conversation.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faEye,
  faEyeSlash,
  faComments,
  faPlus,
  faCheck,
  faArrowDown,
  faArrowUp,
  faTrash,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import AuraSpeechRecognition from "../AuraSpeechRecognition";

export default function Conversation() {
  const conversationsObj = useSelector((state) => state.conversationReducer);
  const conversationsArr = Object.values(conversationsObj);
  const messagesObj = useSelector((state) => state.messageReducer);
  const messages = Object.values(messagesObj);
  const dispatch = useDispatch();
  const [displaySpeaking, setDisplaySpeaking] = useState(false);
  const [show, setShow] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [title, setTitle] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [messageToPost, setMessageToPost] = useState("");
  const [id, setId] = useState(null);
  const bottomOfConversation = useRef(null);
  const topOfConversation = useRef(null);
  const dropdownRef = useRef();
  const conversation = conversationsObj[id] || undefined;

  const handleEditClick = () => {
    setEditMode(true);
    setNewTitle(title);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleUpdateClick = () => {
    conversation.title = newTitle;
    const updatedConversation = { ...conversation, title: newTitle };
    dispatch(updateConversation(updatedConversation));
  };

  const handleTitleBlur = () => {
    if (title !== newTitle) {
      setTitle(newTitle);
      handleUpdateClick();
    }
    setEditMode(false);
  };

  const handleConversationShowClick = () => {
    setShow(!show);
    setDisplaySpeaking(!displaySpeaking);
  };

  const handleDeleteConversationClick = () => {
    if (id) {
      dispatch(deleteConversation(id));
      setId(null);
      dispatch(getConversations());
    }
  };

  const handleSendQueryClick = () => {
    if (messageToPost === "" || id === null) {
      return;
    }
    const conversation = {
      conversation_id: id,
      message: messageToPost,
    };
    dispatch(postMessage(conversation));
    setMessageToPost("");
  };

  const handleMessageToPost = (e) => {
    setMessageToPost(e.target.value);
  };

  const handleCreateConversation = async () => {
    const newConversation = {
      title: "New Conversation",
    };
    let data = await dispatch(postConversation(newConversation));
    if (data) {
      setId(data.id);
    }
  };

  const handleScrollToBottom = () => {
    bottomOfConversation.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const handleScrollToTop = () => {
    topOfConversation.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const handleIconClick = (e) => {
    // click event was propagating to document, preventing dropdown from opening
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleSetConversationClick = (conversation) => {
    setId(conversation.id);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if DOM element rendered && event.target(click) is not contained in DOM element setShow(false)
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(getConversations());
    if (id) {
      dispatch(getMessages(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (conversation) {
      setTitle(conversation.title);
    }
    if (!conversation) {
      setTitle("");
    }
  }, [conversation]);

  return (
    <div className="conversation-container">
      <div className="conversation-button-container">
        <div className="button-container">
          <button onClick={handleIconClick} title="choose conversation">
            <FontAwesomeIcon icon={faComments} />
          </button>
          <button
            onClick={handleCreateConversation}
            title="create conversation"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          {id && (
            <button
              onClick={handleDeleteConversationClick}
              title="delete conversation"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>

        <AuraSpeechRecognition />
      </div>

      <div className="conversation-content">
        <div id="user-display-text"></div>
        <div id="ai-display-text"></div>
        {showDropdown && conversationsArr && (
          <div className="conversations-dropdown" ref={dropdownRef}>
            {conversationsArr.map((conversation) => {
              return (
                <div
                  key={`conversation ${conversation.id}`}
                  className="conversation-title"
                  onClick={(e) => handleSetConversationClick(conversation)}
                >
                  {conversation && conversation.title}
                </div>
              );
            })}
          </div>
        )}
        {id && editMode ? (
          <input
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            autoFocus
          />
        ) : (
          id && (
            <div className="note-title">
              <h4>{title}</h4>
              <FontAwesomeIcon icon={faPen} onClick={handleEditClick} />
            </div>
          )
        )}
        <div className="messages-container" ref={topOfConversation}>
          {id && (
            <div className="message-textarea-container">
              <div>
                {messages &&
                  conversation &&
                  messages.map((message) => (
                    <div key={message.id} className="message-container">
                      <div className="user-message">{message.message}</div>
                      <div className="ai-message">{message.ai_response}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="conversation-input-container">
        <textarea
          id="message-textarea"
          onChange={handleMessageToPost}
          placeholder="Send a message"
          ref={bottomOfConversation}
        ></textarea>
        <button>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
}
