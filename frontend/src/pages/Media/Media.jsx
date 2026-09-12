import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  FaImage,
  FaVideo,
  FaPlus,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";
import EventPhoto from "../EventPhoto/EventPhoto.jsx";
import EventVideo from "../EventVideo/EventVideo.jsx";
import styles from "./Media.module.css";
import authStyles from "../../assets/styles/auth.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { ROLES } from "../../utils/constants";
import { api } from "../../services/api";

export default function EventMedia() {
  const { seasonId, eventId } = useParams();
  const { user, role } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("photos");
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);

  const isAuthenticated = !!user;
  const isAdmin =
    role === ROLES.ADMIN || role === "Admin" || user?.role === "Admin";
  const currentUserId = user?.id || user?._id;

  const fetchMedia = async () => {
    if (!eventId) return;

    try {
      setLoading(true);
      const response = await api.get(
        `/seasons/${seasonId}/events/${eventId}/media`,
      );
      const data = response.data;

      const rawData = data?.media || data?.data?.media || data?.data || [];

      setMediaList(Array.isArray(rawData) ? rawData : []);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [seasonId, eventId]);

  const photos = mediaList.filter((item) =>
    item.mimeType?.startsWith("image/"),
  );
  const videos = mediaList.filter((item) =>
    item.mimeType?.startsWith("video/"),
  );

  const handleDeleteMedia = async (mediaId) => {
    try {
      const response = await api.delete(
        `/seasons/${seasonId}/events/${eventId}/media/${mediaId}`,
      );
      if (response.data?.success) {
        fetchMedia();
      }
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    try {
      setIsUploading(true);
      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append("media", file);
      });

      const response = await api.post(
        `/seasons/${seasonId}/events/${eventId}/media`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data?.success) {
        setSelectedFiles([]);
        setShowUploadModal(false);
        fetchMedia();
      }
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className={styles.bg}>
        <div className="container-md py-5 text-light min-vh-100 mt-5">
          <div className="d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center mb-4 gap-3 border-bottom border-secondary pb-3">
            <div className="d-flex align-items-center gap-3">
              <h2
                className={`${styles.textHeading} fw-bold mb-0 d-flex align-items-center gap-2`}
              >
                Event Gallery
              </h2>
            </div>

            {isAuthenticated && (
              <button
                className={`btn ${authStyles.submitBtn} mx-0 w-auto px-4 fs-5 fw-bold d-flex align-items-center justify-content-center gap-2`}
                onClick={() => setShowUploadModal(true)}
              >
                <FaPlus />{" "}
                {activeTab === "photos" ? "Upload Photo" : "Upload Video"}
              </button>
            )}
          </div>

          <div className="d-flex justify-content-center mb-5">
            <div
              className={`btn-group ${styles.btnContainer} p-1 rounded-pill border border-secondary`}
            >
              <button
                className={`btn ${styles.btnColor} rounded-pill px-4 fw-bold d-flex align-items-center gap-2 ${
                  activeTab === "photos" ? "bg-white" : "text-light"
                }`}
                onClick={() => setActiveTab("photos")}
              >
                <FaImage /> Photos ({photos.length})
              </button>
              <button
                className={`btn ${styles.btnColor} rounded-pill px-4 fw-bold d-flex align-items-center gap-2 ${
                  activeTab === "videos" ? "bg-white" : "text-light"
                }`}
                onClick={() => setActiveTab("videos")}
              >
                <FaVideo /> Videos ({videos.length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center my-5 py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : activeTab === "photos" ? (
            <EventPhoto
              photos={photos}
              onDelete={handleDeleteMedia}
              onPreview={setPreviewMedia}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ) : (
            <EventVideo
              videos={videos}
              onDelete={handleDeleteMedia}
              onPreview={setPreviewMedia}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          )}

          {showUploadModal && isAuthenticated && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center z-3"
              style={{
                backgroundColor: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                className={`card ${styles.modal} text-light border-secondary p-4 w-100`}
                style={{ maxWidth: "500px" }}
              >
                <h4
                  className={`fw-bold ${styles.modalText} mb-3 d-flex align-items-center gap-2`}
                >
                  <FaCloudUploadAlt />
                  {activeTab === "photos" ? "Upload Photos" : "Upload Videos"}
                </h4>

                <form onSubmit={handleUploadSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-secondary">
                      Select {activeTab === "photos" ? "Photos" : "Videos"} (Max
                      5 files)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept={activeTab === "photos" ? "image/*" : "video/*"}
                      className="form-control border-secondary"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className={`btn ${authStyles.submitBtn} mx-0 fs-5 w-50`}
                      onClick={() => setShowUploadModal(false)}
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`btn ${authStyles.submitBtn} mx-0 fs-5 w-50`}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {previewMedia && (
            <div
              className={styles.previewOverlay}
              onClick={() => setPreviewMedia(null)}
            >
              <div
                className={styles.previewContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.closePreviewBtn}
                  onClick={() => setPreviewMedia(null)}
                >
                  <FaTimes />
                </button>

                {previewMedia.type === "image" ? (
                  <img
                    src={previewMedia.url}
                    alt="Expanded Preview"
                    className={styles.previewMedia}
                  />
                ) : (
                  <video
                    src={previewMedia.url}
                    controls
                    autoPlay
                    className={styles.previewMedia}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
