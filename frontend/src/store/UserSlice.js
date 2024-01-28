import { createSlice } from "@reduxjs/toolkit";




export const UserSlice = createSlice({
    name:"UserSlice",
    initialState:{
        id:"",
        name:"",
        role:""
    },
    reducers:{
        setNewUser:(state,action)=>{
            state._id=action.payload.id
            state.role = action.payload.type
            state.name = action.payload.name
        } ,
        logoutUser:(state,action)=>{
            state._id=""
            state.name=""
            state.role=""
        }
    },
    extraReducers: (builder)=>{

    }
});

export const {
    setNewUser,
    logoutUser
} = UserSlice.actions;

export default UserSlice.reducer;