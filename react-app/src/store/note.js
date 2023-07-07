// constant variables for action creator
const GET_NOTE = "note/GET_NOTE"
const GET_NOTES = "note/GET_NOTES";
const UPDATE_NOTE = "notes/UPDATE_NOTE"
const POST_NOTE = "note/POST_NOTE";
const DELETE_NOTE = "note/DELETE_NOTE"

// action creators - define actions (objects with type/data)
const getNoteAC = (data) => ({
  type: GET_NOTE,
  data
})

const getNotesAC = (data) => ({
  type: GET_NOTES,
  data,
});

const postNoteAC = (data) => ({
  type: POST_NOTE,
  data,
});

const updateNoteAC = (data) => ({
  type: UPDATE_NOTE,
  data
})

const deleteNoteAC = (data) => ({
  type: DELETE_NOTE,
  data
})

// thunk action creators - for asynchronous code, i.e., fetch calls prior to dispatching action creators
export const getNote = (id) => async (dispatch) => {
  const response = await fetch(`/api/notes/${id}`)

  if (response.ok) {
    const data = await response.json();
    dispatch(getNoteAC(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const getNotes = () => async (dispatch) => {
  const response = await fetch("/api/notes");

  if (response.ok) {
    const data = await response.json();
    dispatch(getNotesAC(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const postNote = (note) => async (dispatch) => {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(postNoteAC(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const updateNote = (note) => async (dispatch) => {

  const response = await fetch(`/api/notes/${note.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateNoteAC(data));

    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const deleteNote = (id) => async (dispatch) => {

  const response = await fetch(`/api/notes/${id}`, {
    method: "DELETE"
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteNoteAC(data));

    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

// state
const initialState = {};

// reducer
export default function noteReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case GET_NOTE: {
      newState[action.data.id] = action.data
      return newState
    }
    case GET_NOTES: {
      action.data.notes.forEach(note => {
        newState[note.id] = note
      })
      return newState;
    }
    case POST_NOTE: {
      newState[action.data.id] = action.data
      return newState;
    }
    case UPDATE_NOTE: {
      newState[action.data.id] = action.data
      return newState
    }
    case DELETE_NOTE: {
      delete newState[action.data.deleted.id]
      return newState
    }
    default:
      return state;
  }
}
