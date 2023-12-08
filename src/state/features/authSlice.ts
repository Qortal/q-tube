import { createSlice } from '@reduxjs/toolkit';


interface AuthState {
  user: {
    address: string;
    publicKey: string;
    name?: string;
  } | null;
}
const initialState: AuthState = {
  user: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { addUser } = authSlice.actions;

export default authSlice.reducer;