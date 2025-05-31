import Dashboardlayout from "./Dashboardlayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAndProfile } from "../redux/feature/Slice.jsx";
import styles from "../style/profile.module.css";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const dispatch = useDispatch();
   const navigate = useNavigate();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(getUserAndProfile(token));
      // dispatch(getAllPost());
    }
  }, []);
  console.log(authState.user);

  return (
    <Dashboardlayout>
      <div className={styles.containet}>
        <div className={styles.containerimg}>
          <div className={styles.containerimgurl}>
           
            {authState.user?.userId?.profilePicture?.url && (
              // <img
              //   src={`http://localhost:8080/${authState.user.userId.profilePicture.url}`}
              //   alt="Profile"
              //   style={{
              //     height: "115px",
              //     width: "115px",
              //     borderRadius: "50%",
              //     objectFit: "cover",
              //   }}
              // />

              <img
                  src={
                    authState.user.userId.profilePicture.url.startsWith("http")
                      ? authState.user.userId.profilePicture.url
                      : `http://localhost:8080/${authState.user.userId.profilePicture.url}`
                  }
                  alt="Profile"
                  style={{
                    height: "115px",
                 width: "115px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
            )}
          </div>
        </div>
        
      
      
      <div className={styles.profilecontainer}>
         
        <div style={{ display: "flex", position: "relative", right: "45px" }}>
          <div style={{ flex: "0.8" }}>
            <div style={{position:"absolute",bottom:"230px",left:"460px"} }>
             
             <button className={styles.connectBtn} onClick={()=>{navigate("/ProfileEdit")}} >Edit</button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "start",
                // width: "fit-content",
                gap: "1.2rem",
                position: "relative",
                right: "190px",
                bottom:"7rem"
              }}
            >
              <h2>{authState.user.userId.name}</h2>
              <p style={{ color: "gray" }}>{authState.user.userId.username}</p>
            </div>
           
          </div>
        </div>
         <div style={{position:"absolute",bottom:"19rem",left:"2.5rem"}}>
          <p><b>Bio</b>-{authState.user?.bio}</p>
          
        </div>
        <div style={{position:"absolute",bottom:"17rem",left:"2.5rem"}}>
          <p><b>CurrentPost</b>-{authState.user?.currentPost}</p>
        </div>


        <div className={styles.workhistory}>
          <h4>Work History</h4>
          <div className={styles.workHistoryContainer}>
            {authState.user.pastWork.map((work, index) => (
              <div key={index} className={styles.workHistoryCard}>
                <p
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                  }}
                >
                  {work.company} - {work.role}
                </p>
                <p>{work.duration}</p>
              </div>
            ))}
          </div>
         
        </div>

        <div className={styles.workhistory}>
          <h4>Education</h4>
          <div className={styles.workHistoryContainer}>
            {authState.user.education.map((work, index) => (
              <div key={index} className={styles.workHistoryCard}>
                <p
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                  }}
                >
                  {work.school} 
                </p>
                <p>{work.degree}</p>
              </div>
            ))}
          </div>
         
        </div>
      </div>
      </div>
    </Dashboardlayout>
  );
}
