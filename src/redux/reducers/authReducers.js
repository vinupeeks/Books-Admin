import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    }
  },
});

export const selectAuthToken = (state) => state?.auth?.token;
export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;