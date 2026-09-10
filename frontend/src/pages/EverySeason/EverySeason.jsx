import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
} from "react-icons/fa";
import styles from "./EverySeason.module.css";

export default function EverySeason() {
  const params = useParams();
  const seasonId = params.seasonId || params.id;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    description: "",
  });

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "Admin" && Boolean(token);

  const API_BASE_URL = `http://localhost:3000/api/seasons/${seasonId}/events`;

  const fetchEvents = async () => {
    if (!seasonId) return;

    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      const fetchedEvents =
        response.data?.data?.events || response.data?.events || [];
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seasonId) {
      fetchEvents();
    }
  }, [seasonId]);

  const handleOpenAddModal = () => {
    setEditingEventId(null);
    setFormData({ name: "", imageUrl: "", description: "" });
    setShowModal(true);
  };

  const handleOpenEditModal = (eventItem, e) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingEventId(eventItem.id || eventItem._id);
    setFormData({
      name: eventItem.name || "",
      imageUrl: eventItem.imageUrl || "",
      description: eventItem.description || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEventId(null);
    setFormData({ name: "", imageUrl: "", description: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    try {
      if (editingEventId) {
        await axios.put(`${API_BASE_URL}/${editingEventId}`, formData, config);
      } else {
        await axios.post(API_BASE_URL, formData, config);
      }
      handleCloseModal();
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event.");
    }
  };

  const handleDeleteEvent = async (eventId, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAdmin) return;
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`${API_BASE_URL}/${eventId}`, config);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  return (
    <div className="container-md py-5 text-light min-vh-100 mt-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 border-bottom border-secondary pb-3">
        <div className="d-flex align-items-center gap-3">
          
          <h2 className={`${styles.textHeading} fw-bold mb-0 d-flex align-items-center gap-2`}>
            <FaCalendarAlt /> Season Events
          </h2>
        </div>

        {isAdmin && (
          <button
            className="btn btn-warning fw-bold d-flex align-items-center gap-2"
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
            return (
              <div key={currentEventId} className="col-12 col-md-6 col-lg-4">
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
                      />

                      {isAdmin && (
                        <div className="position-absolute top-0 end-0 m-2 d-flex gap-2 z-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => handleOpenEditModal(eventItem, e)}
                            title="Edit Event"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={(e) =>
                              handleDeleteEvent(currentEventId, e)
                            }
                            title="Delete Event"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h4 className={`card-title fw-bold mb-2 ${styles.cardText}`}>
                        {eventItem.name}
                      </h4>
                      <p
                        className="card-text text-light-50 flex-grow-1"
                        style={{ color: "#bbb" }}
                      >
                        {eventItem.description}
                      </p>
                      <div className="mt-3 text-end">
                        <span className={`btn ${styles.btnEvents} btn-sm fw-bold`}>
                          View Media &rarr;
                        </span>
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
                <label className="form-label text-secondary">Event Name</label>
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
                <label className="form-label text-secondary">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  className="form-control bg-dark text-light border-secondary"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary">Description</label>
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
  );
}
