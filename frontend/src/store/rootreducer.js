import {combineReducers} from "@reduxjs/toolkit";
import EventSlice from "./EventSlice";
import UserSlice from "./UserSlice";
import CourseSlice from "./CourseSlice";
import EventTypeSlice from "./EventTypeSlice";
import CollegeSlice from "./CollegeSlice"
export default combineReducers({
    EventSlice,
    UserSlice,
    CourseSlice ,
    EventTypeSlice,
    CollegeSlice
});