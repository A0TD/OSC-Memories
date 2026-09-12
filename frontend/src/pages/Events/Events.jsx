import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import styles from "./Events.module.css";
import authStyles from "../../assets/styles/auth.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { ROLES } from "../../utils/constants";
import { api } from "../../services/api";

const DEFAULT_IMAGE = "https://via.placeholder.com/300x180?text=OSC+Event";

export default function Events() {
  const params = useParams();
  const seasonId = params.seasonId || params.id;

  const { user, role } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const isAdmin =
    role === ROLES.ADMIN || role === "Admin" || user?.role === "Admin";

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingEventId, setEditingEventId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchEvents = async () => {
    if (!seasonId) return;

    setLoading(true);
    setFetchError(null);
    try {
      const response = await api.get(`/seasons/${seasonId}/events`);
      const data = response.data;
      if (data?.success) {
        const fetchedEvents =
          data.events || data.data?.events || data.data || [];
        setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
      } else {
        setFetchError(data.message || "Failed to load events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setFetchError(
        error.response?.data?.message ||
          "Failed to load events. Please check your network connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seasonId) {
      fetchEvents();
    }
  }, [seasonId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingEventId(null);
    setFormData({ name: "", description: "", imageUrl: "" });
    setImageFile(null);
    setShowModal(true);
  };

  const handleOpenEdit = (eventItem, e) => {
    e.stopPropagation();
    e.preventDefault();
    setModalMode("edit");
    const currentId = eventItem.id || eventItem._id;
    setEditingEventId(currentId);
    setFormData({
      name: eventItem.name || "",
      description: eventItem.description || "",
      imageUrl: eventItem.imageUrl || "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setActionLoading(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      if (imageFile) {
        payload.append("media", imageFile);
      }

      if (modalMode === "edit") {
        await api.put(
          `/seasons/${seasonId}/events/${editingEventId}`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      } else {
        await api.post(`/seasons/${seasonId}/events`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      alert(error.response?.data?.message || `Failed to ${modalMode} event`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (eventId, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAdmin) return;

    if (deleteConfirmId === eventId) {
      setActionLoading(true);
      try {
        await api.delete(`/seasons/${seasonId}/events/${eventId}`);
        setDeleteConfirmId(null);
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        alert(error.response?.data?.message || "Failed to delete event");
      } finally {
        setActionLoading(false);
      }
    } else {
      setDeleteConfirmId(eventId);
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  return (
    <div className="text-light min-vh-100 position-relative">
      <div className={`${styles.heroSection} d-flex align-items-center`}>
        <div className="container-md">
          <h1
            className={`fw-bold display-4 d-flex align-items-center gap-2 ${styles.seasonsHeading}`}
          >
            <FaCalendarAlt /> Season Events
          </h1>
          <p className="lead md-w-50 fw-medium">
            Browse through all scheduled events for this season.
          </p>
        </div>
      </div>

      <div className={styles.allCards}>
        <div className="container-md">
          <div className="d-flex justify-content-center align-items-center w-100">
            {isAdmin && (
              <button
                className={`btn ${authStyles.submitBtn} mt-5 mx-0 fw-bold w-50 fs-5`}
                onClick={handleOpenCreate}
              >
                <FaPlus /> Create New Event
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
                  onClick={fetchEvents}
                >
                  Try Again
                </button>
              </div>
            ) : events.length > 0 ? (
              events.map((eventItem) => {
                const currentEventId = eventItem.id || eventItem._id;
                const isDeleting = deleteConfirmId === currentEventId;

                return (
                  <div
                    key={currentEventId}
                    className="col-12 col-md-6 col-lg-4"
                  >
                    <div
                      className={`card text-light border-secondary h-100 position-relative ${styles.seasonCard}`}
                    >
                      {isAdmin && (
                        <div className="position-absolute top-0 end-0 p-2 d-flex gap-2 z-2">
                          <button
                            className={`btn btn-sm ${styles.btn}`}
                            onClick={(e) => handleOpenEdit(eventItem, e)}
                            title="Edit Event"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={`btn btn-sm ${styles.btn}`}
                            onClick={(e) => handleDelete(currentEventId, e)}
                            title="Delete Event"
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
                        to={`/seasons/${seasonId}/events/${currentEventId}/media`}
                        className="text-decoration-none h-100 d-flex flex-column text-light"
                      >
                        <img
                          src={eventItem.imageUrl || DEFAULT_IMAGE}
                          alt={eventItem.name || "event photo"}
                          className="card-img-top"
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className={`card-title fw-bold ${styles.text}`}>
                            {eventItem.name}
                          </h5>
                          <p className={`card-text small mb-4 ${styles.text}`}>
                            {eventItem.description || "No description included"}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-light my-5 w-100">
                <p>No events found for this season yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
                  Event Name
                </label>
                <input
                  type="text"
                  className="form-control border-secondary"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className={`form-label ${styles.text}`}>
                  Choose Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control border-secondary"
                  onChange={handleFileChange}
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
                  className="form-control border-secondary"
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
                      ? "Create Event"
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
