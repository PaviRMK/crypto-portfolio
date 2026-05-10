import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { updateUserProfile } from "../services/userApi";
import "../styles/pages/profile.css";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

function ProfilePage() {
  const { user, loading: userLoading, error: userError, updateUserProfile: updateUserInContext } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (user) {
      console.log("[ProfilePage] User updated:", user);
      setName(user?.name || "");
      setEmail(user?.email || "");
    }
  }, [user]);

  const joinDate = user?.joinDate 
    ? formatDate(user.joinDate)
    : "N/A";

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save
      setIsSaving(true);
      setSaveError("");
      try {
        console.log("[ProfilePage] Saving profile changes:", { name, email });
        const updated = await updateUserProfile({
          name,
          email
        });
        console.log("[ProfilePage] Profile updated:", updated);
        updateUserInContext(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        setIsEditing(false);
      } catch (err) {
        console.error("[ProfilePage] Save failed:", err);
        setSaveError(err.message || "Failed to update profile");
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  if (userLoading) {
    return (
      <section className="profile-page">
        <div className="profile-card">
          <h2>Profile</h2>
          <div className="skeleton-block" />
          <div className="skeleton-block" />
          <div className="skeleton-block" />
        </div>
      </section>
    );
  }

  if (userError && !user) {
    return (
      <section className="profile-page">
        <div className="profile-card error">
          <h2>Profile</h2>
          <p className="error-message">Failed to load profile: {userError}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-card">
        <h2>Profile</h2>

        {saveSuccess && <p className="success-message">Profile updated successfully!</p>}
        {saveError && <p className="error-message">{saveError}</p>}
        {userError && <p className="warning-message">{userError}</p>}

        <div className="profile-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={!isEditing}
            placeholder={user?.name || "Name not available"}
          />
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={!isEditing}
            placeholder={user?.email || "Email not available"}
          />
        </div>

        <div className="profile-field">
          <label>Join Date</label>
          <p className="join-date">{joinDate}</p>
        </div>

        <button 
          className="edit-btn" 
          onClick={handleEditToggle}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : isEditing ? "Save Profile" : "Edit Profile"}
        </button>
      </div>
    </section>
  );
}

export default ProfilePage;
