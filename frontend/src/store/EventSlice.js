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
   

export const fetchAllEvents = createAsyncThunk(
    "fetchAllEvents",
    async({course,page},{getState})=>{
        const token = localStorage.getItem("token");
        try{
            const response = await axios.get(`${API_URL}/api/events/getevents`,{
                params:{
                    course:course,
                    // page:page,
                },
                headers:{
                    "auth-token": token,
                }
            });
            // console.log(response,"res");
            return response.data;
        }
        catch(error){
            console.log(error)
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
            state.data = action.payload.data;
            state.totalEvents = action.payload.totalEvents;
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