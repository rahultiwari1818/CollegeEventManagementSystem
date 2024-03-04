import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
    isLoading:true,
    data:[]
}

const API_URL = process.env.REACT_APP_BASE_URL;

export const fetchAllCourses = createAsyncThunk(
    "fetchAllCourses",
    async(data,{getState})=>{
        const token = localStorage.getItem("token");

        try{
            const response = await axios.get(`${API_URL}/api/course/getCourses`,{
                headers:{
                    "auth-token": token,
                }
            });
            return response.data.data || [];
        }
        catch({response}){
           return []
        }
    }
);


export const CourseSlice = createSlice({
    name:"CourseSlice",
    initialState:initialState,
    reducers:{
        updateCourse:(state,action)=>{

        }
    },
    extraReducers : (builder)=>{
        builder
        .addCase(fetchAllCourses.pending,(state,action)=>{
            state.isLoading = true;
        })
        .addCase(fetchAllCourses.fulfilled,(state,action)=>{
            state.data = action.payload;
            state.isLoading = false;
        })
        .addCase(fetchAllCourses.rejected,(state,action)=>{
            console.log(action,"payload")
            state.isError = true;
            state.isLoading = false;
            state.errorObj = action.payload;
        })
    }

});

export const {
    updateCourse
} = CourseSlice.actions;

export default CourseSlice.reducer;