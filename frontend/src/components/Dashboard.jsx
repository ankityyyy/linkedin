import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllPost,
  upLoadPost,
  deletePost,
  incrementLike,
} from "../redux/feature/PostSlice";
import {
  getUserAndProfile,
  getUserAndProfileAll,
} from "../redux/feature/Slice";
import Dashboardlayout from "./Dashboardlayout";
import styles from "../style/Dashboard.module.css";
import server from "../env";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);
  

  const [post, setPost] = useState("");
  const [fileContent, setFileContent] = useState();

  const handlePost = async () => {
    await dispatch(upLoadPost({ file: fileContent, body: post }));
    setFileContent(null);
    setPost("");
    dispatch(getAllPost());
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (authState.isToken) {
      dispatch(getUserAndProfile(token));
      dispatch(getAllPost());
    }

    if (!authState.allUserProfileFetch) {
      dispatch(getUserAndProfileAll());
    }
  }, [authState.isToken]);



  return (
    <>
      <Dashboardlayout>
        <div className={styles.container}>
          <div className={styles.wraper}>
            <div className={styles.containerProfile}>
              {authState.user?.userId?.profilePicture?.url && (
                <img
                  src={
                    authState.user.userId.profilePicture.url.startsWith("http")
                      ? authState.user.userId.profilePicture.url
                      : `${server}/${authState.user.userId.profilePicture.url}`
                  }
                  alt="Profile"
                  style={{
                    height: "80px",
                    borderRadius: "50%",
                    width: "80px",
                    objectFit: "cover"
                  }}
                />
              )}
              <textarea
                onChange={(e) => setPost(e.target.value)}
                value={post}
                placeholder="post here"
              ></textarea>

              <label htmlFor="fileupload">
                <div className={styles.fs}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    width="24"
                    height="24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </label>

              <input
                type="file"
                onChange={(e) => setFileContent(e.target.files[0])}
                hidden
                id="fileupload"
              />

              {post.length > 0 && (
                <div className={styles.postShow}>
                  <div onClick={handlePost}>Post</div>
                </div>
              )}
            </div>

            <div className={styles.postContainer}>
              {postState.post.map((posts) => (
                <div key={posts._id} className={styles.containerPostSingle}>
                  <div className={styles.singleCardpostimg}>
                    {posts?.userId?.profilePicture?.url && (
                      <img
                        src={
                          posts?.userId.profilePicture.url.startsWith(
                            "http"
                          )
                            ? posts?.userId.profilePicture.url
                            :`${server}/${posts?.userId.profilePicture.url}`
                        }
                        alt="Profile"
                        style={{
                          height: "80px",
                          borderRadius: "50%",
                          width: "80px",
                          border:"2px solid white"
                        }}
                      />
                    )}

                    <div className={styles.poatName}>
                      <p style={{ fontWeight: "bold" }}>{posts.userId.name}</p>
                      {posts?.userId?._id === authState?.user?.userId?._id && (
                        <svg
                          onClick={() =>
                            dispatch(deletePost({ id: posts?._id }))
                          }
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                          style={{
                            width: "7%",
                            color: "red",
                            cursor: "pointer",
                          }}
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className={styles.poatUserName}>
                    <p>@-{posts.userId.username}</p>
                    <p>{posts.body}</p>
                  </div>

                  <div className={styles.singleCardf}>
                    <img
                      alt="Post"
                      src={`https://res.cloudinary.com/dl8mm2ypi/image/upload/${posts.media}`}
                    />
                  </div>
                  <div className={styles.optionContainer}>
                    <div className={styles.optionContainerLike}>
                      <svg
                        onClick={async () => {
                          await dispatch(incrementLike({ id: posts?._id }));
                          dispatch(getAllPost());
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                        style={{ cursor: "pointer" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                        />
                      </svg>
                      <p>{posts.likes}</p>
                    </div>

                    <div className={styles.optionContainerLike}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                        style={{ cursor: "pointer" }}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                      </svg>
                    </div>

                    <div className={styles.optionContainerLike}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                        style={{ cursor: "pointer" }}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                        />
                      </svg>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dashboardlayout>
    </>
  );
}
