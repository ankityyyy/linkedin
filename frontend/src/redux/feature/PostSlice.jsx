import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import server from "../../env";


export const getAllPost = createAsyncThunk("post/getAllPost", async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${server}/Post`);
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: "Something went wrong" });
  }
});


export const upLoadPost = createAsyncThunk("post", async (userData, thunkAPI) => {
  
  try {
    const token = localStorage.getItem("token");
    const { file, body } = userData;
    const formData = new FormData();
    console.log("token",localStorage.getItem("token"))
    formData.append("body", body);
    formData.append("media", file);
    console.log("Sending Post Data:", { body, file, token: localStorage.getItem("token") });

    const response = await axios.post(`${server}/Post`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
    });
    if(response.status==200){
      return thunkAPI.fulfillWithValue("post created");

    }else{
      return thunkAPI.rejectWithValue('post not upload')
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: "Something went wrong" });
  }
});


export const deletePost = createAsyncThunk("post/deletePost", async (userData, thunkAPI) => {

  try {
    const token = localStorage.getItem("token");
    let {id}=userData;
    const response = await axios.delete( `${server}/Post/${id}`,{ headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    },}
     
    );
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: "Something went wrong" });
  }
});


export const incrementLike = createAsyncThunk("post/Like", async (post_id, thunkAPI) => {

  try {
    const token = localStorage.getItem("token");
    let {id}=post_id;
    const response = await axios.post( `${server}/Post/like/${id}`,{ headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    },}
     
    );
    return thunkAPI.fulfillWithValue(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: "Something went wrong" });
  }
});












const initialState = {
  post: [],
  loading: false,
  error: false,
  postFetched: false,
  profileFetched: false,
  loggedin: false,
  message: "",
  comment: [],
  postId: [],
 
};



export  const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(getAllPost.pending, (state) => {
        state.loading = true;
        state.message = "Fetching posts...";
      })
      .addCase(getAllPost.fulfilled, (state, action) => {
        state.loading = false;
        state.postFetched = true;
        state.loggedin = true;
        state.post = action.payload.post.reverse();
        state.message = action.payload.message;
      })
      .addCase(getAllPost.rejected, (state, action) => {
        state.loading = false;
        state.postFetched = false;
        state.loggedin = false;
        state.error = true;
        state.message = action.payload?.message || "Failed to fetch posts";
      })
    
  },
});

export default postSlice.reducer;
