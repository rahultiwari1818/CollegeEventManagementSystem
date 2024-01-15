import {combineReducers} from "@reduxjs/toolkit";
import EventSlice from "./EventSlice";
import UserSlice from "./UserSlice";
export default combineReducers({
    EventSlice,
    UserSlice
});