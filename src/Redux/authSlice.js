import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    token: null,
    userName: null,
    role: null,
    mobile: null,
    userId: null
  },
  reducers: {
    setToken:(state, action)=>{
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.role = action.payload.role;
      state.mobile = action.payload.mobile;
      state.userId = action.payload.userId;
    },
    removeToken:(state)=>{
      state.token =  null;
      state.userName = null;
      state.role = null;
      state.mobile = null;
      state.userId = null;
    }
  },
});

export const { setToken, removeToken } = authSlice.actions;
export default authSlice.reducer;
