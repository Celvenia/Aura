import React, { useEffect, useRef, useState } from "react";
import "./Notes.css";
import { useDispatch, useSelector } from "react-redux";
import { getNotes } from "../../store/note";
import NoteCreate from "../NoteCreate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Note from "../Note";

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

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setIsOpen(false);
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

  return (
    <>
      <div className="note-dropdown-container">
        <div
          ref={dropdownRef}
          className="note-dropdown-header"
          title="Note dropdown"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>
            {selectedNote ? notesObj[selectedNote.id]?.title : "Notes"}
          </span>
          <div className={`arrow ${isOpen ? "up" : "down"}`}>⇩</div>
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
          title="Create new note"
          onClick={(e) => setSelectedNote(null)}
        >
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
        </button>
      </div>
      {selectedNote ? <Note note={selectedNote} /> : <NoteCreate />}
    </>
  );
}
