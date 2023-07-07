// constant variables for action creator
const GET_MESSAGES = "message/GET_MESSAGES";
const POST_MESSAGE = "message/POST_MESSAGE";
const DELETE_MESSAGES = "message/DELETE_MESSAGES";
const POST_MESSAGE_TO_CONVERSATION = "message/POST_MESSAGE_TO_CONVERSATION"

// action creators - define actions (objects with type/data)
const getMessagesAC = (messages) => ({
  type: GET_MESSAGES,
  messages,
});

const postMessageAC = (data) => ({
  type: POST_MESSAGE,
  data,
});

const deleteMessagesAC = (data) => ({
  type: DELETE_MESSAGES,
  data,
});

const postMessageToConversationAC = (data) => ({
  type: POST_MESSAGE_TO_CONVERSATION ,
  data,
});

// thunk action creators - for asynchronous code, i.e., fetch calls prior to dispatching action creators
export const getMessages = (conversation_id) => async (dispatch) => {
  const response = await fetch(`/api/messages/${conversation_id}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getMessagesAC(data.messages));
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

export const postMessage = (conversation) => async (dispatch) => {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversation),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(postMessageAC(data));
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

export const deleteMessages = () => async (dispatch) => {
  const response = await fetch(`/api/conversations`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteMessagesAC(data));

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

export const postMessageToConversation = (conversation) => async (dispatch) => {
  //  conversation = {"conversation_id": 1,"message": "hello"}
  const response = await fetch(`/api/messages/testing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversation),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(postMessageToConversationAC(data));
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
export default function messageReducer(state = initialState, action) {
  const newState = {...state};
  switch (action.type) {
    case GET_MESSAGES: {
      const newState = {};
      action.messages.forEach((message) => {
        newState[message.id] = message;
      });
      return newState;
    }
    case POST_MESSAGE: {
      newState[action.data.id] = action.data;
      return newState;
    }
    case DELETE_MESSAGES: {
      return {};
    }
    case POST_MESSAGE_TO_CONVERSATION: {
      return newState;
    }
    default:
      return state;
  }
}
