import React,{useEffect} from 'react'
import Dashboardlayout from "./Dashboardlayout";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserAndProfileAll} from '../redux/feature/Slice';
import styles from '../style/Discover.module.css';


export default function Discover() {
    const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    
      if (!authState. allUserProfileFetch) {
        dispatch(getUserAndProfileAll()); 
      }
    }, [authState.isToken]); 

    
    
  return (
      <Dashboardlayout>
           <>
           {/* {console.log(authState.allUserProfile)} */}
           {authState.allUserProfileFetch && authState.allUserProfile.map((user) => {
  const profilePicUrl = user.userId?.profilePicture?.url;
  
  return (
    <div key={user._id} className={styles.DiscoverProfile}>
      <img
                  src={
                    authState.user.userId.profilePicture.url.startsWith("http")
                      ? authState.user.userId.profilePicture.url
                      : `http://localhost:8080/${authState.user.userId.profilePicture.url}`
                  }
                  alt="Profile"
                  style={{
                    height: "80px",
                 width: "80px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
      <div className={styles.DiscoverProfilename}>
        <p style={{fontWeight:"BOLD", fontSize:"28PX", paddingTop:'35px'}}>{user.userId?.name || "N/A"}</p>
      <p  className={styles.DiscoverProfileusername} onClick={()=>{
        navigate(`/ViewProfile/${user.userId?.username}`)

      }}>{user.userId?.username || "N/A"}</p>
      </div>
      
    </div>
  );
})}

          </>
         </Dashboardlayout>
  
  )
}
