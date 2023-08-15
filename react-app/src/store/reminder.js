// constant variables for action creator
const GET_REMINDER = "reminder/GET_REMINDER";
const GET_REMINDERS = "reminder/GET_REMINDERS";
const UPDATE_REMINDER = "reminder/UPDATE_REMINDER";
const POST_REMINDER = "reminder/POST_REMINDER";
const DELETE_REMINDER = "reminder/DELETE_REMINDER";
const CHECK_UPDATE_REMINDER = "reminder/CHECK_UPDATE_REMINDER";

// action creators - define actions (objects with type/data)
const getReminderAC = (data) => ({
  type: GET_REMINDER,
  data,
});

const getRemindersAC = (data) => ({
  type: GET_REMINDERS,
  data,
});

const postReminderAC = (data) => ({
  type: POST_REMINDER,
  data,
});

const updateReminderAC = (data) => ({
  type: UPDATE_REMINDER,
  data,
});

const deleteReminderAC = (data) => ({
  type: DELETE_REMINDER,
  data,
});

const checkUpdateReminderAC = (data) => ({
  type: CHECK_UPDATE_REMINDER,
  data,
});

// thunk action creators - for asynchronous code, i.e., fetch calls prior to dispatching action creators
// read reminder
export const getReminder = (id) => async (dispatch) => {
  const response = await fetch(`/api/reminders/${id}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getReminderAC(data));
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

// read reminders
export const getReminders = () => async (dispatch) => {
  const response = await fetch("/api/reminders");

  if (response.ok) {
    const data = await response.json();
    dispatch(getRemindersAC(data));
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

// create reminder
export const postReminder = (reminder) => async (dispatch) => {
  console.log(reminder);
  const response = await fetch("/api/reminders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(postReminderAC(data));
    return data;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.error) {
      return data;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

// update reminder
export const updateReminder = (reminder) => async (dispatch) => {
  const response = await fetch(`/api/reminders/${reminder.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateReminderAC(data));

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

export const deleteReminder = (id) => async (dispatch) => {
  const response = await fetch(`/api/reminders/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteReminderAC(data));

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

// check and update reminders
export const checkAndUpdateReminders =
  (filteredRemindersArr) => async (dispatch) => {
    const response = await fetch("/api/reminders/check-and-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filteredRemindersArr }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(checkUpdateReminderAC(data));
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
export default function reminderReducer(state = initialState, action) {
  const newState = { ...state };
  switch (action.type) {
    case GET_REMINDER: {
      newState[action.data.id] = action.data;
      return newState;
    }
    case GET_REMINDERS: {
      action.data.reminders.forEach((reminder) => {
        newState[reminder.id] = reminder;
      });
      return newState;
    }
    case POST_REMINDER: {
      newState[action.data.id] = action.data;
      return newState;
    }
    case UPDATE_REMINDER: {
      newState[action.data.id] = action.data;
      return newState;
    }
    case DELETE_REMINDER: {
      delete newState[action.data.deleted.id];
      return newState;
    }
    case CHECK_UPDATE_REMINDER: {
      // action.data.reminders.forEach((reminder) => {
      //   newState[reminder.id] = reminder;
      // });
      return newState;
    }
    default:
      return state;
  }
}
