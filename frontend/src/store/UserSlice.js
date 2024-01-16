import { createSlice } from "@reduxjs/toolkit";




export const UserSlice = createSlice({
    name:"UserSlice",
    initialState:{
        _id:"",
        name:"",
        role:"",
        isLoggedIn:false
    },
    reducers:{
        setNewUser:(state,action)=>{
            state._id=action.payload._id
            state.role = action.payload.role
            state.name = action.payload.name
            state.isLoggedIn = action.payload.isLoggedIn
            // console.log(action.payload)
        } ,
        logoutUser:(state,action)=>{
            state._id=""
            state.name=""
            state.role=""
            state.isLoggedIn=false
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