import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./Profile.module.css";
import authStyles from "../../assets/styles/auth.module.css";

function Profile() {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    fetchProfileData();
    fetchUserMedia();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get("/users/me");
      if (response.data?.success) {
        const userData = response.data.user;
        setProfile(userData);
        setNewUsername(userData.username || "");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMedia = async () => {
    try {
      const response = await api.get("/users/me/media");
      if (response.data?.success) {
        setMediaList(response.data.media || []);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const trimmedUsername = newUsername.trim();
    if (!trimmedUsername) return;

    setActionLoading(true);
    try {
      const response = await api.patch("/users/me", {
        username: trimmedUsername,
      });

      if (response.data?.success) {
        const updatedUser = response.data.user;
        setProfile(updatedUser);
        if (setUser) setUser(updatedUser);

        const storedUser = localStorage.getItem("osc_user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            parsed.username = updatedUser.username;
            localStorage.setItem("osc_user", JSON.stringify(parsed));
          } catch {
            localStorage.setItem("osc_user", JSON.stringify(updatedUser));
          }
        } else {
          localStorage.setItem("osc_user", JSON.stringify(updatedUser));
        }

        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setActionLoading(true);
    try {
      const response = await api.delete("/users/me");

      if (response.data?.success) {
        setIsDeleteModalOpen(false);
        localStorage.removeItem("osc_user");
        localStorage.removeItem("token");
        if (logout) await logout();
        navigate("/register");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      alert(err.response?.data?.message || "Failed to delete account");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div className={` overflow-hidden ${styles.hero}`}>
        <div className="profile-page min-vh-100 py-5 mt-5 ">
          <div className="container">
            <div className="row g-4">
              <aside className="col-12 col-md-4 col-lg-3">
                <div
                  className={`card ${styles.card} border-secondary text-center p-4 shadow`}
                >
                  <h4 className={`card-title ${styles.text} fw-bold mb-1`}>
                    {profile?.username || user?.username || "User"}
                  </h4>
                  <span className={`badge ${styles.text} mb-4 px-3 py-2 fs-6`}>
                    {profile?.role || user?.role || "Member"}
                  </span>

                  <div className="d-grid gap-2 w-100">
                    <button
                      className={`${authStyles.submitBtn} fs-5 mx-auto`}
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      Edit Profile
                    </button>

                    <button
                      className={`${authStyles.submitBtn} fs-5 mx-auto`}
                      onClick={() => setIsDeleteModalOpen(true)}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </aside>

              <main className="col-12 col-md-8 col-lg-9">
                <div
                  className={`card ${styles.card} border-secondary p-4 shadow min-vh-50`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary pb-3">
                    <h3 className={`h4 ${styles.text} fw-bold m-0 `}>
                      My Uploaded Media{" "}
                      <span className=" fs-5">({mediaList.length})</span>
                    </h3>
                  </div>

                  {mediaList.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <p className="fs-5">No media uploaded yet.</p>
                    </div>
                  ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                      {mediaList.map((item) => {
                        const mediaId = item.id || item._id;
                        const isVideo = item.mimeType?.startsWith("video");
                        return (
                          <div key={mediaId} className="col">
                            <div
                              className="card bg-black border-secondary position-relative overflow-hidden media-card"
                              style={{ cursor: "pointer" }}
                              onClick={() => setSelectedMedia(item)}
                            >
                              {isVideo ? (
                                <div className="ratio ratio-16x9 position-relative">
                                  <video src={item.url} preload="metadata" />
                                  <div className="play-overlay d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle">
                                    <span className="badge bg-dark rounded-circle p-2 fs-4">
                                      ▶
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="ratio ratio-16x9">
                                  <img
                                    src={item.url}
                                    alt="Uploaded content"
                                    className="img-fluid object-fit-cover rounded"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>

          {isEditModalOpen && (
            <div
              className="modal d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div
                  className={`modal-content ${styles.card} border-secondary`}
                >
                  <div className="modal-header border-secondary">
                    <h5 className={`modal-title ${styles.text} fw-bold`}>
                      Edit Profile
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setIsEditModalOpen(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleUpdateProfile}>
                    <div className="modal-body">
                      <div className="mb-3 text-start">
                        <label className={`form-label ${styles.text} small`}>
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control border-secondary"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="modal-footer border-secondary">
                      <button
                        type="button"
                        className={`btn ${authStyles.submitBtn} mx-0 w-100 fs-5`}
                        onClick={() => setIsEditModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`btn ${authStyles.submitBtn} mx-0 w-100 fs-5`}
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div
              className="modal d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div
                  className={`modal-content ${styles.card} border-secondary`}
                >
                  <div className="modal-header border-secondary">
                    <h5 className={`modal-title ${styles.text} fw-bold`}>
                      Confirm Account Deletion
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setIsDeleteModalOpen(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p className={`${styles.text} mb-0`}>
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </p>
                  </div>
                  <div className="modal-footer border-secondary">
                    <button
                      type="button"
                      className={`btn ${authStyles.submitBtn} mx-0 w-100 fs-5`}
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={`btn ${authStyles.submitBtn} mx-0 w-100 fs-5`}
                      onClick={handleDeleteAccount}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Deleting..." : "Yes, Delete My Account"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedMedia && (
            <div
              className="modal d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
              onClick={() => setSelectedMedia(null)}
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`modal-content border-secondary overflow-hidden ${styles.card}`}
                >
                  <div className="modal-header border-secondary">
                    <h5 className={`${styles.text} modal-title fw-bold`}>
                      Media Preview
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setSelectedMedia(null)}
                    ></button>
                  </div>
                  <div className="modal-body text-center p-0">
                    {selectedMedia.mimeType?.startsWith("video") ? (
                      <video
                        src={selectedMedia.url}
                        controls
                        autoPlay
                        className="w-100"
                        style={{ maxHeight: "80vh", objectFit: "contain" }}
                      />
                    ) : (
                      <img
                        src={selectedMedia.url}
                        alt="Full Preview"
                        className="img-fluid w-100"
                        style={{ maxHeight: "80vh", objectFit: "contain" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
