import {configureStore} from '@reduxjs/toolkit'
import  authReducer from "../feature/Slice.jsx"
import postReducer from "../feature/PostSlice.jsx"
const Store=configureStore({
     reducer:{
auth:authReducer,
post:postReducer
     }
})

export default Store;