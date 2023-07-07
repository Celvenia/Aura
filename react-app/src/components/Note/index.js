import React, { useEffect, useState } from "react";
import "./Note.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteNote, getNote, updateNote } from "../../store/note";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faFile } from "@fortawesome/free-solid-svg-icons";
import NoteCreate from "../NoteCreate";

export default function Note({ note }) {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [display, setDisplay] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setLoading(true);
    setDisplay(true);
    if (note?.content) {
      setContent(note.content);
      setLoading(false);
    }
    if (note?.title) {
      setTitle(note.title);
      setLoading(false);
    }
  }, [dispatch, note]);

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
      const updatedNote = { ...note, title: newTitle, content };
      dispatch(updateNote(updatedNote));
    }
  };

  const handleDeleteClick = () => {
    dispatch(deleteNote(note.id));
    setDisplay(false);
  };

  return (
    display && (
      <div className="note-page">
        <section className="note-container">
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
          {!note ? (
            ""
          ) : editMode ? (
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

          {note && (
            <div className="note-buttons">
              <button onClick={handleUpdateClick} className="note-file-button">
                <FontAwesomeIcon icon={faFile} />
                Save Note
              </button>
              <button onClick={handleDeleteClick}>Delete</button>
            </div>
          )}
        </section>
      </div>
    )
  );
}
