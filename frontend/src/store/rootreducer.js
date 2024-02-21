import {combineReducers} from "@reduxjs/toolkit";
import EventSlice from "./EventSlice";
import UserSlice from "./UserSlice";
import CourseSlice from "./CourseSlice";
import EventTypeSlice from "./EventTypeSlice";

export default combineReducers({
    EventSlice,
    UserSlice,
    CourseSlice ,
    EventTypeSlice
});