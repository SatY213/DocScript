import { createSlice } from "@reduxjs/toolkit";

// --- USER SLICE ---
const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    id: null,
    title: "",
    fullName: "",
    specialty: "",
    firmName: "",
    email: "",
    phone: "",
    isAuthenticated: false,
  },
  reducers: {
    setUserInfo: (state, action) => {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };
    },
    updateUserField: (state, action) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    clearUserInfo: (state) => {
      state.id = null;
      state.title = "";
      state.fullName = "";
      state.specialty = "";
      state.firmName = "";
      state.email = "";
      state.phone = "";
      state.isAuthenticated = false;
    },
  },
});
export const getUserInfo = (state) => state.userInfo;
// --- NOTIFICATIONS SLICE ---
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
    markAsSeen: (state, action) => {
      const id = action.payload;
      const notif = state.items.find((n) => n._id === id);
      if (notif) notif.seen = true;
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsSeen,
  clearNotifications,
} = notificationSlice.actions;

export const { setUserInfo, updateUserField, clearUserInfo } =
  userInfoSlice.actions;

const rootReducer = {
  userInfo: userInfoSlice.reducer,
  notifications: notificationSlice.reducer,
};

export default rootReducer;
