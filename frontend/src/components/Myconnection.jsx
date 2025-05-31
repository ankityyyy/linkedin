import React, { useEffect } from 'react';
import Dashboardlayout from "./Dashboardlayout";
import { getMyConnectionRequest } from "../redux/feature/Slice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from '../style/Myconnection.module.css';

export default function Myconnection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Dispatching connection request with token:", token);
      dispatch(getMyConnectionRequest({ token }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (authState?.connections?.length !== 0) {
      console.log("Connection requests:", authState.connections);
    } else {
      console.log("No connection requests found");
    }
  }, [authState.connections]);

  return (
    <Dashboardlayout>
      <h1>My Connection</h1>

      {
        authState?.connections?.map((user) => {
          const profilePicUrl = user?.connectionId?.profilePicture?.url;
          const name = user?.connectionId?.name || "N/A";
          const username = user?.connectionId?.username || "N/A";

          return (
            <div key={user?._id} className={styles.DiscoverProfile}>
              <img
                src={`http://localhost:8080/${profilePicUrl || "uploads/default.jpg"}`}
                alt="profile"
                style={{ width: "80px", height: "80px", borderRadius: "50%" }}
              />
            
              <div className={styles.DiscoverProfilename}>
                <p style={{ fontWeight: "bold", fontSize: "28px", paddingTop: "35px" }}>{name}</p>
                <p style={{ fontSize: "19px", position:"relative",bottom:"20px"  }}>{username}</p>
              </div>
                <button className={styles.Dashboardlayoutbuttonaccept}>Accept</button>
               <button className={styles.Dashboardlayoutbutton}>Reject</button>
            </div>
          );
        })
      }
    </Dashboardlayout>
  );
}
