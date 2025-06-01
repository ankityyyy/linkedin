import React, { useState } from "react";
import Dashboardlayout from "./Dashboardlayout";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {updateProfileData,uploadProfilePicture} from "../redux/feature/Slice";

export default function ProfileEdit() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: authState?.user?.userId?.name || "",
    bio: authState?.user?.bio || "",
    profilePicture: null,
    pastWork: authState.user.pastWork || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

//     console.log("Submitting profile update:", {
//   name: formData.name,
//   bio: formData.bio,
//   pastWork: formData.pastWork,
// });


    // Dispatch text data update
    await dispatch(
      updateProfileData({
        name: formData.name,
        bio: formData.bio,
        pastWork: formData.pastWork,
      })
    );

    // If profilePicture is selected
    if (formData.profilePicture) {
      await dispatch(uploadProfilePicture(formData.profilePicture));
    }

    navigate("/Profile");
  };

  return (
    <Dashboardlayout>
      <div className="container p-4 border rounded shadow bg-white" style={{position:"relative",right:"80px"}}>
        <h3>Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Bio</label>
            <input
              className="form-control"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Enter your bio"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input
              type="file"
              className="form-control"
              name="profilePicture"
              onChange={handleImageChange}
            />
          </div>

          <div className="mb-3">
            <h5>Work History</h5>
            {formData.pastWork.map((work, index) => (
              <div key={index} className="border rounded p-3 mb-3">
                <input
                  className="form-control mb-2"
                  placeholder="Company"
                  value={work.company}
                  onChange={(e) => {
                    const updated = [...formData.pastWork];
                    updated[index].company = e.target.value;
                    setFormData({ ...formData, pastWork: updated });
                  }}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Role"
                  value={work.role}
                  onChange={(e) => {
                    const updated = [...formData.pastWork];
                    updated[index].role = e.target.value;
                    setFormData({ ...formData, pastWork: updated });
                  }}
                />
                <input
                  className="form-control"
                  placeholder="Duration"
                  value={work.duration}
                  onChange={(e) => {
                    const updated = [...formData.pastWork];
                    updated[index].duration = e.target.value;
                    setFormData({ ...formData, pastWork: updated });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() =>
                setFormData({
                  ...formData,
                  pastWork: [
                    ...formData.pastWork,
                    { company: "", role: "", duration: "" },
                  ],
                })
              }
            >
              + Add Work
            </button>
          </div>

          <div className="mt-4 d-flex gap-3">
            <button type="submit" className="btn btn-success">
              Save
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/dashboard/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Dashboardlayout>
  );
}
