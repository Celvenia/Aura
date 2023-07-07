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
} from "@fortawesome/free-solid-svg-icons";
import AuraIcon from "../../assets/AuraIcon.png";

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

  const handleCreateConversation = () => {
    const newConversation = {
      title: "New Conversation",
    };
    dispatch(postConversation(newConversation));
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
          {show ? <button
              onClick={handleConversationShowClick}
              title="hide ai speech"
            >
              <FontAwesomeIcon icon={faEyeSlash} />
            </button> :
             <button onClick={handleConversationShowClick} >
                         <FontAwesomeIcon icon={faEye} title="display ai speech"/>
                       </button>
            
          }
              <button onClick={handleIconClick} title="choose conversation">
              <FontAwesomeIcon icon={faComments}/>
            </button>
            <button
              onClick={handleCreateConversation}
              title="create conversation"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
{!displaySpeaking &&   <button onClick={handleDeleteConversationClick} title="delete conversation">
<FontAwesomeIcon icon={faTrash} />
            </button>}
            {!displaySpeaking && conversation && (
              <div >
          <FontAwesomeIcon  ref={topOfConversation} onClick={handleScrollToBottom} title="scroll down" icon={faArrowDown} />
                </div>
        )}
      </div>

      <div className="conversation-content">
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

<div className="messages-container"  ref={topOfConversation} >
        {/* {displaySpeaking && (
        "something"
        )} */}

        {!displaySpeaking && id && (
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
            {!displaySpeaking && conversation && (
              <div className="scroll-top-button">
                <FontAwesomeIcon onClick={handleScrollToTop} ref={bottomOfConversation} title="scroll up" icon={faArrowUp} />
              </div>
            )}
          </div>
          
          </div>
        )}
      </div>
      </div>
      <div className="conversation-input-container">
      <textarea
            id="message-textarea"
            onChange={handleMessageToPost}
            placeholder="Write a question here, then hit send..."
            ref={bottomOfConversation}
          ></textarea>
 {!displaySpeaking && <img className="aura-icon" src={AuraIcon} onClick={handleSendQueryClick}></img>}
      </div>
    </div>
  );

  // return (
  //   <div className="conversation-container">
  //     <div
  //       className="conversation-button-container"
  //     >
  //       {!displaySpeaking && conversation && (
  //         <button title="scroll down" onClick={handleScrollToBottom}>⇩</button>
  //       )}
  //       {show ? (
  //         <>
  //           <button
  //             onClick={handleConversationShowClick}
  //             title="displaySpeaking conversation messages"
  //           >
  //             <FontAwesomeIcon icon={faEyeSlash} />
  //           </button>
  //           <button onClick={handleIconClick} title="choose conversation">
  //             <FontAwesomeIcon icon={faComments}/>
  //           </button>
  //           {!showDropdown ? (
  //             ""
  //           ) : conversationsArr ? (
  //             <div className="conversations-dropdown" ref={dropdownRef}>
  //               {conversationsArr.map((conversation) => {
  //                 return (
  //                   <div
  //                     key={`conversation ${conversation.id}`}
  //                     className="conversation-title"
  //                     onClick={(e) => handleSetConversationClick(conversation)}
  //                   >
  //                     {conversation && conversation.title}
  //                   </div>
  //                 );
  //               })}
  //             </div>
  //           ) : (
  //             ""
  //           )}
  //           <button
  //             onClick={handleCreateConversation}
  //             title="create conversation"
  //           >
  //             <FontAwesomeIcon icon={faPlus} />
  //           </button>
  //           <button onClick={handleDeleteConversationClick} title="delete conversation">
  //             Delete Conversation
  //           </button>
  //         </>
  //       ) : (
  //         <>
  //           <button onClick={handleConversationShowClick} title="hide conversation messages">
  //             <FontAwesomeIcon icon={faEye} />
  //           </button>
  //           <button onClick={handleIconClick}>
  //             <FontAwesomeIcon icon={faComments}/>
  //           </button>
  //           <button onClick={handleCreateConversation} title="create conversation">
  //             <FontAwesomeIcon icon={faPlus} />
  //           </button>
  //           {!showDropdown ? (
  //             ""
  //           ) : conversationsArr ? (
  //             <div className="conversations-dropdown" ref={dropdownRef}>
  //               {conversationsArr &&
  //                 conversationsArr.map((conversation) => {
  //                   return (
  //                     <div
  //                       key={`conversation ${conversation.id}`}
  //                       className="conversation-title"
  //                       onClick={(e) =>
  //                         handleSetConversationClick(conversation)
  //                       }
  //                     >
  //                       {conversation && conversation.title}
  //                     </div>
  //                   );
  //                 })}
  //             </div>
  //           ) : (
  //             ""
  //           )}
  //         </>
  //       )}
  //       {!displaySpeaking && <button onClick={handleSendQueryClick}>Send Query</button>}
  //     </div>


  //     {editMode ? (
  //       <div className="title-active-edit">
  //         <input
  //           type="text"
  //           maxLength="40"
  //           value={newTitle}
  //           onBlur={handleTitleBlur}
  //           onChange={handleTitleChange}
  //           autoFocus
  //         />
  //       </div>
  //     ) : id ? (
  //       <div className="title-inactive-edit">
  //         <span title="conversation title">
  //           {conversation && (
  //             <h4 id="set-conversation" data-conversation-id={conversation.id}>
  //               {title}
  //             </h4>
  //           )}
  //         </span>
  //         <FontAwesomeIcon
  //           icon={faPen}
  //           onClick={handleEditClick}
  //           className="edit-icon"
  //         />
  //       </div>
  //     ) : (
  //       <div>Create/Choose Conversation</div>
  //     )}

  //     <div className="messages-container" ref={topOfConversation} >
  //       {/* {displaySpeaking && (
  //       "something"
  //       )} */}

  //       {!displaySpeaking && id && (
  //         <div className="message-textarea-container">
  //           <div>
  //           {messages &&
  //             conversation &&
  //             messages.map((message) => (
  //               <div key={message.id} className="message-container">
  //                 <div className="user-message">{message.message}</div>
  //                 <div className="ai-message">{message.ai_response}</div>
  //               </div>
  //             ))}
  //           {/* {!displaySpeaking && conversation && (
  //             <div className="scroll-top-button">
  //               <button onClick={handleScrollToTop} ref={bottomOfConversation} title="scroll up">
  //                 ⇧
  //               </button>
  //             </div>
  //           )} */}
  //         </div>
  //         <textarea
  //           id="message-textarea"
  //           onChange={handleMessageToPost}
  //           placeholder="Write a question here, then hit send..."
  //         ></textarea>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}
