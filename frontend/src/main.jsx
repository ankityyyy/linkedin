import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './redux/app/Store.jsx';
import { Provider } from 'react-redux'
import HomePage from './components/HomePage.jsx'
import UserLog from './components/userLog.jsx';
import Dashboard from './components/Dashboard.jsx';
import NavBar from './components/navBar.jsx';
import  Myconnection from './components/Myconnection.jsx'
import  Discover from './components/Discover.jsx'
import ViewProfile from './components/ViewProfile.jsx';
import Profile from './components/Profile.jsx';
import ProfileEdit from './components/ProfileEdit.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
     <BrowserRouter>
     <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<UserLog/>} />
           <Route path="/Profile" element={< Profile />} />
        <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/ProfileEdit" element={<ProfileEdit/>} />
        <Route path="/connection" element={< Myconnection/>} />
        <Route path="/Discover" element={<  Discover/>} />
     <Route path="/ViewProfile/:username" element={<ViewProfile />} />
    

       
      </Routes>
     
    </BrowserRouter>
  
</Provider>,
)
