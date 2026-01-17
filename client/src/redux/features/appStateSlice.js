import { createSlice } from "@reduxjs/toolkit";

// SLICE
export const appStateSlice = createSlice({
    name: "AppState",
    initialState: {
        appState: ""
    },
    reducers: {
        setAppState: (state, action) => {
            state.appState = action.payload;
        }
    }
});

// ACTIONS
export const {
    setAppState
} = appStateSlice.actions;

export default appStateSlice.reducer;