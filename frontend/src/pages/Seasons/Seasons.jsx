import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Seasons.module.css";
import { FaArrowRight, FaEdit, FaTrash, FaPlus, FaExclamationTriangle } from "react-icons/fa";
import defaultImage from "../../assets/img/Seasons_Photo.jpg";

export default function Seasons() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://localhost:3000/api/seasons";

  const token = null
  const userRole = null 
  const isAdmin = null

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

  const fetchSeasons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      const extractedSeasons = response.data?.data?.seasons || [];
      setSeasons(extractedSeasons);
    } catch (error) {
      console.error("Error fetching seasons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
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
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        imageUrl: formData.imageUrl,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (modalMode === "create") {
        await axios.post(API_BASE_URL, payload, config);
      } else {
        await axios.put(`${API_BASE_URL}/${currentSeasonId}`, payload, config);
      }

      setShowModal(false);
      fetchSeasons();
    } catch (error) {
      console.error(`Error ${modalMode} season:`, error);
      alert("Unauthorized or server error!");
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();

    if (deleteConfirmId === id) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`${API_BASE_URL}/${id}`, config);
        setDeleteConfirmId(null);
        fetchSeasons();
      } catch (error) {
        console.error("Error deleting season:", error);
      }
    } else {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  return (
    <div className="text-light min-vh-100 position-relative">
      {/* Hero Section */}
      <div className={`${styles.heroSection} d-flex align-items-center`}>
        <div className="container-md">
          <h1 className={`fw-bold display-4 ${styles.seasonsHeading}`}>
            Seasons Management
          </h1>
          <p className="lead md-w-50 fw-medium">
            Explore and check out all available OSC seasons and their events.
          </p>

          {/* زر إضافة موسم جديد يظهر للأدمن فقط */}
          {isAdmin && (
            <button
              className="btn btn-warning mt-3 fw-bold d-flex align-items-center gap-2"
              onClick={handleOpenCreate}
            >
              <FaPlus /> Create New Season
            </button>
          )}
        </div>
      </div>

      {/* Cards List Section */}
      <div className={styles.allCards}>
        <div className={`container-md ${styles.allCards}`}>
          <div className="row g-4 py-5">
            {loading ? (
              <div className="text-center text-light my-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : seasons.length > 0 ? (
              seasons.map((season) => {
                const seasonId = season._id || season.id;
                const isDeleting = deleteConfirmId === seasonId;

                return (
                  <div key={seasonId} className="col-12 col-md-6 col-lg-4">
                    <div className={`card text-light border-secondary h-100 position-relative ${styles.seasonCard}`}>
                      
                      {isAdmin && (
                        <div className="position-absolute top-0 end-0 p-2 d-flex gap-2 z-2">
                          <button
                            className="btn btn-sm btn-info text-white shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(season);
                            }}
                            title="Edit Season"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={`btn btn-sm shadow ${
                              isDeleting ? "btn-danger px-3" : "btn-outline-danger bg-dark"
                            }`}
                            onClick={(e) => handleDelete(seasonId, e)}
                            title="Delete Season"
                          >
                            {isDeleting ? (
                              <span className="fw-bold d-flex align-items-center gap-1">
                                <FaExclamationTriangle /> Confirm?
                              </span>
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      )}

                      {/* رابط كارت الموسم للجميع ينقل إلى مسار الأحداث */}
                      <Link
                        to={`/seasons/${seasonId}/events`}
                        className="text-decoration-none h-100 d-flex flex-column text-light"
                      >
                        <img
                          src={season.imageUrl || season.image || defaultImage}
                          alt={season.name || "season photo"}
                          className="card-img-top"
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className={`card-title fw-bold ${styles.text}`}>
                            {season.name}
                          </h5>
                          <p className="text-muted small mb-2">
                            {season.date ? new Date(season.date).toLocaleDateString() : "No Date"}
                          </p>
                          <p className={`card-text small mb-4 ${styles.text}`}>
                            {season.description || "No description included"}
                          </p>

                          <div className="mt-auto d-flex justify-content-end">
                            <div
                              className={`${styles.icon} rounded-circle d-flex align-items-center justify-content-center`}
                              style={{ width: "30px", height: "30px" }}
                            >
                              <FaArrowRight />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-light my-5">
                <p>No seasons found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal التعديل والإنشاء للأدمن فقط */}
      {isAdmin && showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center z-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(5px)" }}
        >
          <div className="card bg-dark text-light border-secondary p-4 w-100" style={{ maxWidth: "500px" }}>
            <h3 className="mb-4 fw-bold text-warning">
              {modalMode === "create" ? "Create New Season" : "Update Season"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary">Season Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary">Date</label>
                <input
                  type="date"
                  className="form-control bg-dark text-light border-secondary"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary">Choose Image from Device</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control bg-dark text-light border-secondary"
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
                <label className="form-label text-secondary">Description</label>
                <textarea
                  className="form-control bg-dark text-light border-secondary"
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
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-warning fw-bold">
                  {modalMode === "create" ? "Create" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}