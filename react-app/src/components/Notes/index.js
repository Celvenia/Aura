import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotes, deleteNote, updateNote, postNote } from "../../store/note";
import NoteCreate from "../NoteCreate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPlus,
  faTrash,
  faStickyNote,
  faPen,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import "./Notes.css";

export default function Notes() {
  const currentUser = useSelector((state) => state.session.user);
  const notesObj = useSelector((state) => state.noteReducer);
  const dispatch = useDispatch();
  const [selectedNote, setSelectedNote] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [displayCreate, setDisplayCreate] = useState(true);
  const notesArr = Object.values(notesObj);
  const notes = notesArr.filter((note) => note.user_id === currentUser?.id);
  const dropdownRef = useRef(null);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [display, setDisplay] = useState(false);
  const [errors, setErrors] = useState([]);
  const [active, setActive] = useState(false);

  const startDictation = async (e) => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      setActive(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.addEventListener("result", (event) => {
        const transcript = event.results[0][0].transcript;
        setContent(content + " " + transcript);
        setActive(false);
      });

      recognition.addEventListener("end", () => {
        setActive(false);
      });

      recognition.start();
    } else {
      alert("Web Speech API is not supported in this browser.");
    }
  };

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setIsOpen(false);
  };

  const handleDeleteClick = () => {
    dispatch(deleteNote(selectedNote.id));
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setNewTitle("");
  };

  useEffect(() => {
    dispatch(getNotes());
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setDisplay(true);
    if (selectedNote?.content) {
      setContent(selectedNote.content);
      setLoading(false);
    }
    if (selectedNote?.title) {
      setTitle(selectedNote.title);
      setLoading(false);
    }
  }, [dispatch, selectedNote]);

  const handleEditClick = () => {
    setEditMode(true);
    setNewTitle(title);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setErrors([]);
    if (title !== newTitle) {
      if (!title || !newTitle) {
        setErrors(["Title or content cannot be empty"]);
      } else {
        setTitle(newTitle);
        handleUpdateClick();
      }
    }
    setEditMode(false);
  };

  const handleUpdateClick = () => {
    setErrors([]);
    if (!title || content === "") {
      setErrors(["Title or Content cannot be empty"]);
    } else {
      const updatedNote = { ...selectedNote, title: newTitle, content };
      dispatch(updateNote(updatedNote));
    }
  };

  const handleNewTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleNewContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    if (!title || content === "") {
      setErrors(["Title or Content cannot be empty"]);
    } else {
      const newNote = {
        title,
        content,
      };
      dispatch(postNote(newNote));
      setTitle("");
      setContent("");
    }
  };

  const handlePlusClick = (e) => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setNewTitle("");
  };

  return (
    <>
      <div className="note-dropdown-container">
        <div
          ref={dropdownRef}
          className="note-dropdown-header"
          title="Note dropdown"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedNote
            ? `${notesObj[selectedNote.id]?.title.slice(0, 9)}⇩`
            : `Notes⇩`}
        </div>
        {isOpen && (
          <ul className="dropdown-notes">
            {!notes.length ? "No Notes Available" : ""}
            {notes.map((note) => (
              <li
                key={note.id}
                className={`Note ${
                  selectedNote?.id === note?.id ? "selected" : ""
                }`}
                onClick={() => handleNoteSelect(note)}
              >
                {notesObj[note.id].title}
              </li>
            ))}
          </ul>
        )}
        <button
          className="create-note-button"
          title="Create new note form"
          onClick={handlePlusClick}
        >
          <small>
            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          </small>
          {/* <FontAwesomeIcon icon={faStickyNote}></FontAwesomeIcon> */}
        </button>
        {selectedNote ? (
          <button
            onClick={handleUpdateClick}
            className="note-file-button"
            title="save"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="note-file-button"
            title="save"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        )}
        {selectedNote && (
          <button onClick={handleDeleteClick} title="delete">
            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
          </button>
        )}
        <button
          title="start content dictation"
          onClick={startDictation}
          disabled={active}
        >
          <FontAwesomeIcon icon={faMicrophone} />
        </button>
      </div>
      {selectedNote ? (
        <div className="note-page">
          <section className="note-container">
            {errors.length > 0 && (
              <div className="error-container">
                {errors.map((error, index) => (
                  <p
                    key={index}
                    className="error-message"
                    onClick={(e) => setErrors([])}
                  >
                    {error}
                  </p>
                ))}
              </div>
            )}
            {editMode ? (
              <input
                type="text"
                value={newTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                autoFocus
              />
            ) : (
              <div className="note-title">
                <h4>{title}</h4>
                <FontAwesomeIcon icon={faPen} onClick={handleEditClick} />
              </div>
            )}

            {!loading && (
              <form>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="note-textarea"
                  required
                ></textarea>
              </form>
            )}
          </section>
        </div>
      ) : (
        <div className="note-create-container">
          <h4 className="note-create-h4">New Note</h4>
          {errors.length > 0 && (
            <div className="error-container">
              {errors.map((error, index) => (
                <p
                  key={index}
                  className="error-message"
                  onClick={(e) => setErrors([])}
                >
                  {error}
                </p>
              ))}
            </div>
          )}
          <div className="note-create-form-element">
            <label>
              {" "}
              <small>Title</small>
            </label>
            <input
              className="note-create-input"
              title="note title"
              type="text"
              value={title}
              onChange={handleNewTitleChange}
              required
            />
          </div>
          <div className="note-create-form-element">
            <label>
              <small>Content</small>
            </label>
            <textarea
              className="note-create-textarea"
              title="note context"
              value={content}
              onChange={handleNewContentChange}
              required
            ></textarea>
          </div>
        </div>
      )}
    </>
  );
}
