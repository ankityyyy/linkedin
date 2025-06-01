import React, { useState } from "react";
import { data, useParams } from "react-router-dom";
import Dashboardlayout from "./Dashboardlayout";
import styles from "../style/view.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllPost } from "../redux/feature/PostSlice";
import {  getMyConnectionRequest,sendConnectionRequest,} from "../redux/feature/Slice.jsx";
import server from "../env.js";


export default function ViewProfile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const postReducer = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);
  const [userposts, setUserposts] = useState([]);
  const [isconnectionnull, setIsconnectionnull] = useState();
  const [iscurrentuserintheconnection, setIscurrentuserintheconnection] =
    useState(false);
  // const profilePicUrl = authState?.user.userId?.profilePicture?.url;

  const getUserPost = async () => {
    await dispatch(getAllPost);
    await dispatch(
      getMyConnectionRequest({ token: localStorage.getItem("token") })
    );
  };

  useEffect(() => {
    let post = postReducer.post.filter(
      (posts) => posts.userId.username === username
    );
    setUserposts(post);
  }, [postReducer.post]);

  const viewedUser = postReducer.post.find(
    (post) => post.userId.username === username
  )?.userId;

  const userProfile = authState?.allUserProfile.find(
    (profile) => profile.userId?.username === username
  );

  console.log("it not work",viewedUser?._id);

  // const isOwnProfile = viewedUser?._id === authState?.user?.userId?._id;
  const isOwnProfile =
    userProfile?.userId?._id === authState?.user?.userId?._id;

  useEffect(() => {
    if (!viewedUser || !authState?.connections) return;

    const existingConnection = authState.connections.find(
      (conn) => conn.connectionId._id === viewedUser?._id
    );

    if (existingConnection) {
      setIscurrentuserintheconnection(true);
      setIsconnectionnull(existingConnection.status === "pending");
    } else {
      setIscurrentuserintheconnection(false);
    }
  }, [authState.connections, viewedUser]);

  useEffect(() => {
    getUserPost();
  }, []);

  return (
    <Dashboardlayout>
      <div className={styles.containet}>
        <div className={styles.containerimg}>
          <div className={styles.containerimgurl}>
            <img
                  src={
                    authState.user.userId.profilePicture.url.startsWith("http")
                      ? authState.user.userId.profilePicture.url
                      :  `${server}/${authState.user.userId.profilePicture.url}`
                  }
                  alt="Profile"
                  style={{
                    height: "115px",
                 width: "115px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
          </div>
        </div>
      </div>

      <div className={styles.profilecontainer}>
        <div style={{ display: "flex", position: "relative", right: "45px" }}>
          <div style={{ flex: "0.8" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "fit-content",
                gap: "1.2rem",
              }}
            >
              <h2>{userProfile?.userId?.name}</h2>
              <p style={{ color: "gray" }}>{userProfile?.userId?.username}</p>
            </div>
            <div style={{display:"flex",gap:"1em",margin:"2px"}}>
            {iscurrentuserintheconnection ? (
              <button className={styles.connectedButton}>
                {isconnectionnull ? "pending" : "connected"}
              </button>
            ) : (
              !isOwnProfile && (
                <button
                  onClick={() => {
                    dispatch(
                      sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        user_id: viewedUser?._id,
                      })
                    );
                  }}
                  className={styles.connectBtn}
                >
                  Connect
                </button>
              )
            )}
            
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" style={{height:"40px",width:"40px"}} onClick={{}}>
  <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

            </div>
            <div>
              <p>{userProfile?.bio}</p>
            </div>
          </div>
        </div>
        <div style={{ flex: "0.2" }}>
          {userposts.map((post) => {
            return (
              <div key={post._id} className={styles.postCard}>
                <h3>Recent Activity</h3>
                <div className={styles.card}>
                  <div className={styles.card__profileContainer}>
                    {post.media !== "" ? (
                      <img
                        alt="Post"
                        src={`https://res.cloudinary.com/dl8mm2ypi/image/upload/${post.media}`}
                        style={{ height: "70px", width: "70px" }}
                      />
                    ) : (
                      <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                    )}
                  </div>
                  <p>{post.body}</p>
                </div>
              </div>
            );
          })}
        </div>
       
      </div>
       <div className={styles.workhistory}>
          <h4>Work History</h4>
          <div className={styles.workHistoryContainer}>
            {userProfile.pastWork.map((work, index) => (
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
            
    </Dashboardlayout>
  );
}

