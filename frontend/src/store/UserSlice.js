import { createSlice } from "@reduxjs/toolkit";




export const UserSlice = createSlice({
    name:"UserSlice",
    initialState:{
        _id:"",
        name:"",
        role:"",
        course:"",
        semester:0
    },
    reducers:{
        setNewUser:(state,action)=>{
            state._id=action.payload.id
            state.role = action.payload.role
            state.name = action.payload.name
            state.course = action.payload?.course || ""
            state.semester = action.payload?.semester || 0
        } ,
        logoutUser:(state,action)=>{
            state._id=""
            state.name=""
            state.role=""
            state.course=""
            state.semester=0
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