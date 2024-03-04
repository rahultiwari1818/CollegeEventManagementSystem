import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading:true,
    data:[]
}

const API_URL = process.env.REACT_APP_BASE_URL;

export const fetchAllEventTypes = createAsyncThunk(
    "fetchAllEventTypes",
    async(data,{getState})=>{
        const token = localStorage.getItem("token");

        try{
            const response = await axios.get(`${API_URL}/api/eventType/getEventTypes`,{
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


export const EventTypes = createSlice({
    name:"EventTypes",
    initialState:initialState,
    reducers:{
        updateEventType:(state,action)=>{

        }
    },
    extraReducers : (builder)=>{
        builder
        .addCase(fetchAllEventTypes.pending,(state,action)=>{
            state.isLoading = true;
        })
        .addCase(fetchAllEventTypes.fulfilled,(state,action)=>{
            state.data = action.payload;
            state.isLoading = false;
        })
        .addCase(fetchAllEventTypes.rejected,(state,action)=>{
            console.log(action,"payload")
            state.isError = true;
            state.isLoading = false;
            state.errorObj = action.payload;
        })
    }

});

export const {
    updateEventType
} = EventTypes.actions;

export default EventTypes.reducer;