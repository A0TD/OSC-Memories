import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Seasons.module.css";
import authStyles from "../../assets/styles/auth.module.css";
import { FaEdit, FaTrash, FaPlus, FaExclamationTriangle } from "react-icons/fa";

import { AuthContext } from "../../contexts/AuthContext";
import { ROLES } from "../../utils/constants";
import { api } from "../../services/api";

const DEFAULT_IMAGE = "https://via.placeholder.com/300x180?text=OSC+Season";

export default function Seasons() {
  const [seasons, setSeasons] = useState([]);
  const { user, role } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const isAdmin = role === ROLES.ADMIN;

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    description: "",
    imageUrl: "",
  });
  const [currentSeasonId, setCurrentSeasonId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const deleteTimeoutRef = useRef(null);

  const fetchSeasons = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const response = await api.get("/seasons");
      const data = response.data;
      if (data.success) {
        const extractedSeasons = data.seasons;
        setSeasons(Array.isArray(extractedSeasons) ? extractedSeasons : []);
      } else {
        setFetchError(data.message || "Failed to load seasons.");
      }
    } catch (error) {
      console.error("Error fetching seasons:", error);
      setFetchError(
        error.response?.data?.message ||
          "Failed to load seasons. Please check your network connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
    return () => {
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData({ name: "", date: "", description: "", imageUrl: "" });
    setShowModal(true);
  };

  const handleOpenEdit = (season) => {
    setModalMode("edit");
    const seasonId = season._id || season.id;
    setCurrentSeasonId(seasonId);
    const formattedDate = season.date ? season.date.split("T")[0] : "";

    setFormData({
      name: season.name || "",
      date: formattedDate,
      description: season.description || "",
      imageUrl: season.imageUrl || season.image || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setActionLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        date: formData.date
          ? new Date(formData.date).toISOString()
          : new Date().toISOString(),
        imageUrl: formData.imageUrl,
      };

      if (modalMode === "create") {
        await api.post("/seasons", payload);
      } else {
        await api.put(`/seasons/${currentSeasonId}`, payload);
      }

      setShowModal(false);
      fetchSeasons();
    } catch (error) {
      console.error(`Error ${modalMode} season:`, error);
      alert(error.response?.data?.message || `Failed to ${modalMode} season`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (deleteConfirmId === id) {
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
      setActionLoading(true);
      try {
        await api.delete(`/seasons/${id}`);
        setDeleteConfirmId(null);
        fetchSeasons();
      } catch (error) {
        console.error("Error deleting season:", error);
        alert(error.response?.data?.message || "Failed to delete season");
      } finally {
        setActionLoading(false);
      }
    } else {
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
      setDeleteConfirmId(id);
      deleteTimeoutRef.current = setTimeout(
        () => setDeleteConfirmId(null),
        3000,
      );
    }
  };

  return (
    <div className="text-light min-vh-100 position-relative">
      {/* Hero Section */}
      <div className={`${styles.heroSection} d-flex align-items-center`}>
        <div className="container-md">
          <h1 className={`fw-bold display-4 ${styles.seasonsHeading}`}>
            Seasons
          </h1>
          <p className="lead md-w-50 fw-medium">
            Explore and check out all available OSC seasons and their events.
          </p>
        </div>
      </div>

      {/* Cards List Section */}
      <div className={styles.allCards}>
        <div className="container-md">
          <div className="d-flex justify-content-center align-items-center w-100">
            {isAdmin && (
              <button
                className={`btn ${authStyles.submitBtn} mt-5 mx-0 fw-bold w-50 fs-5`}
                onClick={handleOpenCreate}
              >
                <FaPlus /> Create New Season
              </button>
            )}
          </div>
          <div className="row g-4 py-5">
            {loading ? (
              <div className="text-center text-light my-5 w-100">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : fetchError ? (
              <div className="text-center text-danger my-5 w-100">
                <p className="fs-5">{fetchError}</p>
                <button
                  className="btn btn-outline-light btn-sm mt-2"
                  onClick={fetchSeasons}
                >
                  Try Again
                </button>
              </div>
            ) : seasons.length > 0 ? (
              seasons.map((season) => {
                const seasonId = season._id || season.id;
                const isDeleting = deleteConfirmId === seasonId;

                return (
                  <div key={seasonId} className="col-12 col-md-6 col-lg-4">
                    <div
                      className={`card text-light border-secondary h-100 position-relative ${styles.seasonCard}`}
                    >
                      {isAdmin && (
                        <div className="position-absolute top-0 end-0 p-2 d-flex gap-2 z-2">
                          <button
                            className={`btn btn-sm ${styles.btn}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(season);
                            }}
                            title="Edit Season"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={`btn btn-sm ${styles.btn}`}
                            onClick={(e) => handleDelete(seasonId, e)}
                            title="Delete Season"
                            disabled={actionLoading}
                          >
                            {isDeleting ? (
                              <span className="fw-bold d-flex align-items-center gap-1">
                                <FaExclamationTriangle /> Confirm
                              </span>
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      )}

                      <Link
                        to={`/seasons/${seasonId}/events`}
                        className="text-decoration-none h-100 d-flex flex-column text-light"
                      >
                        <img
                          src={season.imageUrl || season.image || DEFAULT_IMAGE}
                          alt={season.name || "season photo"}
                          className="card-img-top"
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className={`card-title fw-bold ${styles.text}`}>
                            {season.name}
                          </h5>
                          <p className={`${styles.text} small mb-2`}>
                            {season.date
                              ? new Date(season.date).toLocaleDateString()
                              : "No Date"}
                          </p>
                          <p className={`card-text small mb-4 ${styles.text}`}>
                            {season.description || "No description included"}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-light my-5 w-100">
                <p>No seasons found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isAdmin && showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center z-3 mt-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            className={`card ${styles.seasonCard} text-light border-secondary p-4 w-100`}
            style={{ maxWidth: "500px" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className={`form-label ${styles.text}`}>
                  Season Name
                </label>
                <input
                  type="text"
                  className="form-control text-dark border-secondary"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className={`form-label ${styles.text}`}>Date</label>
                <input
                  type="date"
                  className="form-control text-dark border-secondary"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className={`form-label ${styles.text}`}>
                  Choose Image from Device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control text-dark border-secondary"
                  onChange={handleImageUpload}
                  required={modalMode === "create" && !formData.imageUrl}
                />
                {formData.imageUrl && (
                  <div className="mt-2 text-center">
                    <img
                      src={formData.imageUrl}
                      alt="Selected Preview"
                      className="img-thumbnail bg-dark border-secondary"
                      style={{ maxHeight: "120px", objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className={`form-label ${styles.text}`}>
                  Description
                </label>
                <textarea
                  className="form-control text-dark border-secondary"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className={`${authStyles.submitBtn} mx-0 fs-6 w-50`}
                  onClick={() => setShowModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${authStyles.submitBtn} mx-0 fs-6 w-50`}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? "Saving..."
                    : modalMode === "create"
                      ? "Create"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
