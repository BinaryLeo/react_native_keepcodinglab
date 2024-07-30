import { createSlice, PayloadAction } from "@reduxjs/toolkit";
const authState = createSlice({
    name: "authState", //Slice name
    initialState: { // Initial state
        logged: false, // Indicative if the user is logged in
        userEmail: "", // User email
        userPassword : "", // User password
        userRole: "", // User role
        userName: "", // User name
    },
    reducers: { // Reducers
        // Action to set the user as logged
        // Receives the user email, user name, user role and user password
        beLogged(state, action: PayloadAction<{ userEmail: string; userName: string; userRole: string; userPassword:string }>) {
            state.logged = true; // Define the state as logged
            state.userEmail = action.payload.userEmail; // Update the user email
            state.userRole = action.payload.userRole; // Update the user role
            state.userPassword = action.payload.userPassword; // Update the user password
            state.userName = action.payload.userName; // Update the user name
        },
        // Action to set the user as unlogged
        beUnlogged(state) {
            state.logged = false; // Define the state as unlogged
            state.userEmail = ""; // Clear the user email
            state.userPassword = ""; // Clear the user password
            state.userRole = ""; // Clear the user role
            state.userName = ""; // Clear the user name
        },
    },
});

export const { beLogged, beUnlogged } = authState.actions;
export default authState.reducer;