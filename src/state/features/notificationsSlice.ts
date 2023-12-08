import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertTypes {
  alertSuccess: string
  alertError: string
  alertInfo: string
}

interface InitialState {
  alertTypes: AlertTypes
}

const initialState: InitialState = {
  alertTypes: {
    alertSuccess: '',
    alertError: '',
    alertInfo: ''
  }
}

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotification: (
      state: InitialState,
      action: PayloadAction<{ alertType: string; msg: string }>
    ) => {
      if (action.payload.alertType === "success") {
        return {
          ...state,
          alertTypes: {
            ...state.alertTypes,
            alertSuccess: action.payload.msg,
          },
        };
      } else if (action.payload.alertType === "error") {
        return {
          ...state,
          alertTypes: {
            ...state.alertTypes,
            alertError: action.payload.msg,
          },
        };
      } else if (action.payload.alertType === "info") {
        return {
          ...state,
          alertTypes: {
            ...state.alertTypes,
            alertInfo: action.payload.msg,
          },
        };
      }
      return state;
    },
    removeNotification: (state: InitialState) => {
      return {
        ...state,
        alertTypes: {
          ...state.alertTypes,
          alertSuccess: '',
          alertError: '',
          alertInfo: ''
        }
      }
    },
  },
});

export const { setNotification, removeNotification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
