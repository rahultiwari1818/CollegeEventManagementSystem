import { createSlice } from "@reduxjs/toolkit";




export const UserSlice = createSlice({
    name:"UserSlice",
    initialState:{
        _id:"",
        name:"",
        role:"",
        course:"",
    },
    reducers:{
        setNewUser:(state,action)=>{
            state._id=action.payload.id
            state.role = action.payload.role
            state.name = action.payload.name
            state.course = action.payload?.course || ""
        } ,
        logoutUser:(state,action)=>{
            state._id=""
            state.name=""
            state.role=""
            state.course=""
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