import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";


let initialState = {
    isLoading : false,
    data:[],
    isError : false,
};

const API_URL = process.env.REACT_APP_BASE_URL;


export const fetchAllEvents = createAsyncThunk(
    "fetchAllEvents",
    async(data,{getState})=>{
        try{
            const response = await axios.get(`${API_URL}/api/events/getevents`);
            // console.log(response,"res");
            return response.data.data || [];
        }
        catch(err){
            alert(err)
            return [];
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
            state.isError = true;

        })
    }

});

export const {
    updateEvent
} = EventSlice.actions;

export default EventSlice.reducer;