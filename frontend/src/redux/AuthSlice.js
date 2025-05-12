import { createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import { get } from '../services/ApiEndpoint';


export const updateUser=createAsyncThunk('updateuser',async()=>{
     try {
        const request=await get('/api/auth/check-auth')
        const response=request.data

        return response.user;
     } catch (error) {
          throw error
     }
})


 const initialState={
    loading:null,
    error:null,
    user:null,
    message: null, // ✅ new field
 }
const  AuthSlice=createSlice({
    name:"Auth",
    initialState:initialState,
    reducers:{
        SetUser:(state,action)=>{
            state.user= action.payload
            state.message = "Welcome to CourseMania 🎉"; // ✅
        },
        Logout:(state)=>{
            state.user=null,
            state.loading=null,
            state.error=null,
            state.message = "You logout successfully, hope to see you soon 👋"; // ✅
        }
    },

    extraReducers:(builder)=>{
        builder.addCase(updateUser.pending,(state)=>{
            state.loading=true
        })
        builder.addCase(updateUser.fulfilled,(state,action)=>{
            state.loading=null,
            state.user=action.payload
        })
        builder.addCase(updateUser.rejected,(state,action)=>{
            state.loading=null,
            state.error=action.error.message,
            state.user=null
            
        })
    }
   
})

export const {SetUser,Logout, ClearMessage}=AuthSlice.actions

export default AuthSlice.reducer