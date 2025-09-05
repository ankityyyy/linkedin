import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../style/UserLog.module.css";
import { emptyMessage, signup, login } from "../redux/feature/Slice";

export default function UserLog() {
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [isLogInMethod, setIsLogInMethod] = useState(false);

  const userRef = useRef({
    name: "",
    username: "",
    password: "",
    number: "",
    email: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = userRef.current.username?.value;
    const password = userRef.current.password?.value;
    if (isLogInMethod) {
      if (!username || !password) {
      
        return;
      }
      dispatch(login({ username, password }));
    } else {
      const name = userRef.current.name?.value || "";
      const number = userRef.current.number?.value || "";
      const email = userRef.current.email?.value || "";

      dispatch(signup({ name, username, password, number, email }));
    }
  };

  useEffect(() => {
    if (authState?.loggedin) {
      navigate("/dashboard");
    }
  }, [authState?.loggedin]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLogInMethod]);

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.cardContainer}>
            <div className={styles.cardContainer_left}>
              <p className={styles.cardContainer_leftheding}>
                {" "}
                {isLogInMethod ? "LogIn" : "Sign Up"}
              </p>
              {/* {authState.message && (
                <p className={styles.message}>{authState.message}</p>
              )} */}

              {authState.message && (
                <p
                  className={
                    authState.success
                      ? styles.successMessage
                      : styles.errorMessage
                  }
                >
                  {typeof authState.message === "string"
                    ? authState.message
                    : authState.message?.message || "Something went wrong"}
                </p>
              )}
              <div>
                <div>
                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder="username"
                    ref={(el) => (userRef.current.username = el)}
                    className={styles.inputfild}
                  />

                  <input
                    type="password"
                    name=""
                    id=""
                    className={styles.inputfild}
                    ref={(el) => (userRef.current.password = el)}
                    placeholder="password"
                  />
                </div>
                {!isLogInMethod && (
                  <div>
                    {" "}
                    <input
                      type="email"
                      name=""
                      id=""
                      className={styles.inputblock}
                      ref={(el) => (userRef.current.email = el)}
                      placeholder="email"
                    />
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="name"
                      className={styles.inputblock}
                      ref={(el) => (userRef.current.name = el)}
                    />
                    <input
                      type="number"
                      name=""
                      id=""
                      placeholder="number"
                      className={styles.inputblock}
                      ref={(el) => (userRef.current.number = el)}
                    />
                  </div>
                )}

                <button className={styles.buttonAuth}>
                  {isLogInMethod ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </div>
            <div className={styles.cardContainer_right}>
              <div>
                <p>All ready Have an Account ?</p>

                <div
                  onClick={() => {
                    setIsLogInMethod(!isLogInMethod);
                  }}
                >
                  <button
                    style={{ marginLeft: "55px", marginTop: "2px" }}
                    className={styles.buttonAuth}
                  >
                    {isLogInMethod ? "Sign Up" : "Sign In"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
