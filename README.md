# LinkedIn  Project

This is a full-stack LinkedIn clone project with separate backend and frontend codebases.

## Project Structure

- **backend/** — Node.js + Express backend API
- **frontend/** — React.js frontend application

## Features

- User authentication (signup/login)
- User profiles with bio, education, and work experience
- Create, edit, and delete posts
- Like and comment on posts
- Upload and manage profile pictures

## Technologies Used

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React.js, Redux (if used), Axios
- Others: Cloudinary for image upload, Socket.IO (if chat included)

## Installation and Setup

### Backend

1. Navigate to the backend folder:
   cd backend

2. Install all required packages:
   npm install

3. Create a .env file in the backend folder to add secret keys and database URLs (example .env file):
CLOUD_NAME=your_cloud_name_here
CLOUD_API_KEY=your_api_key_here
CLOUD_API_SECRET=your_api_secret_here
ATLASDB_URL=your_mongodb_connection_string_here

4. Start the backend server:
   node index.js

### Frontend

1. Navigate to the frontend folder:
   cd frontend

2. Install all required packages:
   npm install

3. Start the React development server:
   npm run dev

## State Management

The project uses Redux for efficient state management across authentication, posts, and profile features.

### Features Managed by Redux:
- **Authentication**: Stores and shares user login data and token.
- **Posts**: Manages post lists, likes, comments, and actions.
- **Profile**: Handles profile bio, education, experience, and image updates.

### Libraries:
- Redux Toolkit
- Redux Thunk
