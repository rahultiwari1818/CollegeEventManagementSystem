import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


let initialState = {
    isLoading : false,
    data:[],
    totalEvents:0,
    isError : false,
    errorObj :{}
};

const API_URL = process.env.REACT_APP_BASE_URL;
   

export const fetchCollegeDetails = createAsyncThunk(
    "fetchCollegeDetails",
    async(data,{getState})=>{
        const token = localStorage.getItem("token");
        try{
            const response = await axios.get(`${API_URL}/api/faculties/getCollegeDetails`,{
                headers:{
                    "auth-token": token,
                }
            });
            return response.data;
        }
        catch(error){
            console.log(error)
           return []
        }
    }
);

export const CollegeSlice = createSlice({
    name:"CollegeSlice",
    initialState:initialState,
    reducers:{
        updateEvent:(state,action)=>{

        }
    },
    extraReducers : (builder)=>{
        builder
        .addCase(fetchCollegeDetails.pending,(state,action)=>{
            state.isLoading = true
        })
        .addCase(fetchCollegeDetails.fulfilled,(state,action)=>{
            state.data = action.payload.data.at(0);
            state.isLoading = false;
        })
        .addCase(fetchCollegeDetails.rejected,(state,action)=>{
            console.log(action,"payload")
            state.isError = true;
            state.isLoading = false;
            state.errorObj = action.payload;
        })
    }

});

export const {
    updateEvent
} = CollegeSlice.actions;

export default CollegeSlice.reducer;