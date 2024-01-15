import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


let initialState = {
    isLoading : false,
    data:[],
    isError : false,
    errorObj :{}
};

const API_URL = process.env.REACT_APP_BASE_URL;
   
const token = localStorage.getItem("token");

export const fetchAllEvents = createAsyncThunk(
    "fetchAllEvents",
    async(data,{getState})=>{
        console.log("token",token)
        try{
            const response = await axios.get(`${API_URL}/api/events/getevents`,{
                headers:{
                    "auth-token": token,
                }
            });
            // console.log(response,"res");
            return response.data.data || [];
        }
        catch({response}){
           return []
        }
    }
);

export const EventSlice = createSlice({
    name:"EventSlice",
    initialState:initialState,
    reducers:{
        updateEvent:(state,action)=>{

        }
    },
    extraReducers : (builder)=>{
        builder
        .addCase(fetchAllEvents.pending,(state,action)=>{
            state.isLoading = true;
        })
        .addCase(fetchAllEvents.fulfilled,(state,action)=>{
            state.data = action.payload;
            state.isLoading = false;
        })
        .addCase(fetchAllEvents.rejected,(state,action)=>{
            console.log(action,"payload")
            state.isError = true;
            state.isLoading = false;
            state.errorObj = action.payload;
        })
    }

});

export const {
    updateEvent
} = EventSlice.actions;

export default EventSlice.reducer;