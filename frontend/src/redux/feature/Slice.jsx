import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "login failed");
    }
  }
);

export const getUserAndProfile = createAsyncThunk(
  "post/getUserAndProfile",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/users/profile?token=${userId}`
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const getUserAndProfileAll = createAsyncThunk(
  "post/getUserAndProfileAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:8080/users/profiles`);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "post/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/users/connections`,
        {
          token: user.token,
          connectionId: user.user_id,
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const getMyConnectionRequest = createAsyncThunk(
  "post/getMyConnectionRequest",
  async (user, thunkAPI) => {
    try {
      console.log("Making API call with token:", user.token);
      const response = await axios.get(
        `http://localhost:8080/users/connections/sent`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("API response:", response.data);
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const connectionsreceived = createAsyncThunk(
  "post/connectionsreceived",
  async (user, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/users/connections/received`,
        {
          token: user.token,
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  "post/acceptConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/users/connections/respond`,
        {
          token: user.token,
          connection_Id: user.connectionId,
          action_type: user.action,
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);




export const updateProfileData = createAsyncThunk(
  "auth/updateProfileData",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        "http://localhost:8080/users/profile/data",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);


export const uploadProfilePicture = createAsyncThunk(
  "auth/uploadProfilePicture",
  async (file, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.patch(
        "http://localhost:8080/users/profile-pictureupload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);



let initialState = {
  user: {},
  loading: false,
  error: null,
  success: false,
  isToken: false,
  loggedin: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionsRequest: [],
  allUserProfile: [],
  allUserProfileFetch: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: () => initialState,
    emptyMessage: (state) => {
      state.message = "";
    },
    setIsToken: (state) => {
      state.isToken = true;
    },
    setIsNotToken: (state) => {
      state.isToken = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        (state.loading = true), (state.message = "signup you..");
      })
      .addCase(signup.fulfilled, (state, action) => {
        (state.loading = false),
          (state.success = true),
          (state.loggedin = true),
          (state.message = action.payload.message);
      })
      .addCase(signup.rejected, (state, action) => {
        (state.success = false),
          (state.loggedin = false),
          (state.message = action.payload?.message || "Signup failed");
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = "login you";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.loggedin = true;
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "login failed";
        state.message = action.payload;
      })
      .addCase(getUserAndProfile.pending, (state) => {
        state.loading = true;
        state.message = "Fetching UserProfile...";
      })
      .addCase(getUserAndProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.loggedin = true;
        state.profileFetched = true;
        state.user = action.payload.profile;
        state.message = action.payload.message;
      })
      .addCase(getUserAndProfile.rejected, (state, action) => {
        state.loading = false;
        state.profileFetched = false;
        state.loggedin = false;
        state.error = true;
        state.message = action.payload?.message || "Failed to fetch posts";
      })
      .addCase(getUserAndProfileAll.fulfilled, (state, action) => {
        (state.allUserProfileFetch = true),
          (state.allUserProfile = action.payload.allUserProfile);
        state.loading = false;
        state.message = action.payload.message;
      })
      // .addCase(getMyConnectionRequest.fulfilled,(state,action)=>{
      //   state.connections= action.payload;

      // })

      .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
        state.connections = Array.isArray(action.payload.sentConnections)
          ? action.payload.sentConnections
          : [];
      })

      .addCase(getMyConnectionRequest.rejected, (state, action) => {
        state.message = action.payload.sentConnections;
      })
      .addCase(connectionsreceived.fulfilled, (state, action) => {
        state.connectionsRequest = action.payload;
      })
      .addCase(connectionsreceived.rejected, (state, action) => {
        state.message = action.payload;
      })

      .addCase(updateProfileData.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateProfileData.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.message = "Profile updated successfully";
      state.user = {
        ...state.user,
        ...action.payload, 
      };
    })
    .addCase(updateProfileData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update profile";
    })

  },
});
export const { emptyMessage, setIsNotToken, setIsToken, reset } =
  userSlice.actions;
export default userSlice.reducer;
