import React, { useEffect } from "react";
import styles from "../style/Dashboardlayouts.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsToken } from "../redux/feature/Slice";



export default function Dashboardlayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (localStorage.getItem("token") == null) {
      navigate("/signup");
    }
    dispatch(setIsToken());
  });

  const handleClickDashbord = () => {
    navigate("/dashboard");
  };
  const handleClickDiscover = () => {
    navigate("/Discover");
  };
  const handleClickConnection = () => {
    navigate("/connection");
  };
  return (
    <div>
      <div className="container">
        <div className={styles.homecontainer}>
          <div className={styles.homecontainer_left}>
            <div
              className={styles.homecontainer_leftSidebar}
              onClick={handleClickDashbord}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <p>Home</p>
            </div>

            <div
              className={styles.homecontainer_leftSidebar1}
              onClick={handleClickDiscover}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <p>Discover</p>
            </div>

            <div
              className={styles.homecontainer_leftSidebar2}
              onClick={handleClickConnection}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              <p>Account</p>
            </div>
          </div>
          <div className={styles.feedcontainer}>{children}</div>
          <div className={styles.extracontainer}>
            <h4>Top Profile</h4>
           
            {authState.allUserProfileFetch &&
              authState.allUserProfile.map((data) => {
                return (
                  <div key={data._id}>
                    <p>{data.userId.name}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
