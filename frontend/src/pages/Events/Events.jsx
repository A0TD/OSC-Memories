import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import styles from "./Events.module.css";
import authStyles from "../../assets/styles/auth.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { ROLES } from "../../utils/constants";
import { useApi } from "../../hooks/useApi";

export default function Events() {
  const params = useParams();
  const seasonId = params.seasonId || params.id;

  const { user, role } = useContext(AuthContext);
  const { request, loading } = useApi();

  const isAdmin =
    role === ROLES.ADMIN || role === "Admin" || user?.role === "Admin";

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchEvents = async () => {
    if (!seasonId) return;

    try {
      const response = await request({
        url: `/seasons/${seasonId}/events`,
        method: "GET",
      });
      const fetchedEvents =
        response?.data?.events || response?.events || response?.data || [];
      setEvents(Array.isArray(fetchedEvents) ? fetchedEvents : []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (seasonId) {
      fetchEvents();
    }
  }, [seasonId]);

  // تايمر إلغاء حالة التأكيد بعد 3 ثوانٍ
  useEffect(() => {
    if (!deletingId) return;

    const timer = setTimeout(() => {
      setDeletingId(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [deletingId]);

  const handleOpenAddModal = () => {
    setEditingEventId(null);
    setFormData({ name: "", description: "" });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const handleOpenEditModal = (eventItem, e) => {
    e.stopPropagation();
    e.preventDefault();
    const currentId = eventItem.id || eventItem._id;
    setEditingEventId(currentId);
    setFormData({
      name: eventItem.name || "",
      description: eventItem.description || "",
    });
    setImageFile(null);
    setImagePreview(eventItem.imageUrl || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEventId(null);
    setFormData({ name: "", description: "" });
    setImageFile(null);
    setImagePreview("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      if (imageFile) {
        payload.append("media", imageFile);
      }

      if (editingEventId) {
        await request({
          url: `/seasons/${seasonId}/events/${editingEventId}`,
          method: "PUT",
          data: payload,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await request({
          url: `/seasons/${seasonId}/events`,
          method: "POST",
          data: payload,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      handleCloseModal();
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDeleteEvent = async (eventId, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAdmin) return;

    if (deletingId !== eventId) {
      setDeletingId(eventId);
      return;
    }

    try {
      await request({
        url: `/seasons/${seasonId}/events/${eventId}`,
        method: "DELETE",
      });
      setDeletingId(null);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <>
      <div className={`${styles.allCards} overflow-hidden`}>
        <div className={`container-md py-5 text-light min-vh-100 mt-5`}>
          <div
            className={`d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center mb-4 gap-3 border-bottom border-secondary pb-3`}
          >
            <div className="d-flex align-items-center gap-3">
              <h2
                className={`${styles.textHeading} fw-bold mb-0 d-flex align-items-center gap-2`}
              >
                <FaCalendarAlt /> Season Events
              </h2>
            </div>

            {isAdmin && (
              <button
                className={`btn ${authStyles.submitBtn} mx-0 w-50 fs-5 fw-bold d-flex align-items-center justify-content-center gap-2`}
                onClick={handleOpenAddModal}
              >
                <FaPlus /> Create New Event
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center my-5 py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : events.length > 0 ? (
            <div className="row g-4">
              {events.map((eventItem) => {
                const currentEventId = eventItem.id || eventItem._id;
                const isConfirmingDelete = deletingId === currentEventId;

                return (
                  <div
                    key={currentEventId}
                    className="col-12 col-md-6 col-lg-4"
                  >
                    <Link
                      to={`/seasons/${seasonId}/events/${currentEventId}/media`}
                      className="text-decoration-none"
                    >
                      <div
                        className={`card ${styles.card} text-light border-secondary h-100 ${styles.eventCard}`}
                      >
                        <div className="position-relative overflow-hidden">
                          <img
                            src={eventItem.imageUrl}
                            alt={eventItem.name}
                            className={`card-img-top ${styles.eventImg}`}
                            style={{
                              height: "220px",
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          />
                        </div>
                        <div className="card-body d-flex flex-column">
                          <h4
                            className={`card-title fw-bold mb-2 ${styles.cardText}`}
                          >
                            {eventItem.name}
                          </h4>
                          <p
                            className={`card-text flex-grow-1 ${styles.cardText}`}
                            
                          >
                            {eventItem.description}
                          </p>
                          <div className="mt-3 position-absolute z-3 top-0 end-0">
                            {isAdmin && (
                              <div className="m-2 d-flex justify-content-end align-items-center gap-2">
                                <button
                                  className={`btn btn-sm ${styles.btn}`}
                                  onClick={(e) =>
                                    handleOpenEditModal(eventItem, e)
                                  }
                                  title="Edit Event"
                                >
                                  <FaEdit />
                                </button>

                                <button
                                  className={`btn btn-sm ${styles.btn}`}
                                  onClick={(e) =>
                                    handleDeleteEvent(currentEventId, e)
                                  }
                                  title={
                                    isConfirmingDelete
                                      ? "Click again to confirm delete"
                                      : "Delete Event"
                                  }
                                >
                                  {isConfirmingDelete ? (
                                    <span className="d-flex align-items-center gap-1">
                                      <FaExclamationTriangle /> Confirm?
                                    </span>
                                  ) : (
                                    <FaTrash />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <p className="fs-4">No events found for this season yet.</p>
            </div>
          )}

          {showModal && isAdmin && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center z-3"
              style={{
                backgroundColor: "rgba(0,0,0,0.8)",
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                className="card bg-dark text-light border-secondary p-4 w-100"
                style={{ maxWidth: "500px" }}
              >
                <h4 className="fw-bold text-warning mb-3">
                  {editingEventId ? "Edit Event" : "Create New Event"}
                </h4>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-secondary">
                      Event Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control bg-dark text-light border-secondary"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary">
                      Choose Cover Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control bg-dark text-light border-secondary"
                      onChange={handleFileChange}
                      required={!editingEventId && !imagePreview}
                    />
                    {imagePreview && (
                      <div className="mt-2 text-center">
                        <img
                          src={imagePreview}
                          alt="Selected Preview"
                          className="img-thumbnail bg-dark border-secondary"
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      className="form-control bg-dark text-light border-secondary"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-warning fw-bold">
                      {editingEventId ? "Save Changes" : "Create Event"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}