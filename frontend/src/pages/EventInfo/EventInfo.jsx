import React, { useState, useEffect, useContext } from "react";
import EventCard from "../../components/EventCard/EventCard";
import { AuthContext } from "../../contexts/AuthContext";
import { useApi } from "../../hooks/useApi";
import eventinfocss from "./EventInfo.module.css";

export default function EventInfo() {
  
  
  const [events, setEvents] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formError, setFormError] = useState("");
  

  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [eventToDeleteId, setEventToDeleteId] = useState(null);
  

  const { request, loading, error } = useApi();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "Admin";

  const fetchEvents = async () => {
    try {
      const response = await request({ method: "GET", url: "/event-infos" });
      setEvents(response.data?.eventInfos || []);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [request]);

const handleDelete = (id) => {
  setEventToDeleteId(id);
  setShowDeleteModal(true);
};


const handleDeleteConfirmed = async () => {
  try {
    await request({ method: "DELETE", url: `/event-infos/${eventToDeleteId}` });
    setEvents(events.filter((event) => event.id !== eventToDeleteId));
    setShowDeleteModal(false);
    setEventToDeleteId(null);
  } catch (err) {
    console.error("Failed to delete event", err);
  }
};

  const handleEdit = (id) => {
    const eventToEdit = events.find((event) => event.id === id);
    if (eventToEdit) {
      setFormData({ name: eventToEdit.name, description: eventToEdit.description });
      setEditEventId(id);
      setIsEditing(true);
      setShowModal(true);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.description.trim()) {
      setFormError("All fields are required.");
      return;
    }

    try {
      if (isEditing) {
   
        const response = await request({
          method: "PUT",
          url: `/event-infos/${editEventId}`,
          data: formData,
        });
        
        const updatedEvent = response.data?.eventInfo || response.data;
        setEvents(events.map((ev) => (ev.id === editEventId ? updatedEvent : ev)));
      } else {

        const response = await request({
          method: "POST",
          url: "/event-infos",
          data: formData,
        });

        const newEvent = response.data?.eventInfo || response.data;
        setEvents([newEvent, ...events]);
      }


      closeModal();
    } catch (err) {
      console.error("Failed to save event", err);
      setFormError(err.response?.data?.message || "Failed to save event.");
    }
  };


  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditEventId(null);
    setFormData({ name: "", description: "" });
    setFormError("");
  };

  if (loading) {
    return <div className="text-center py-5">Loading events...</div>;
  }

  return (
    <div>

      <div className={eventinfocss.heroSection}>
        <h1 className={eventinfocss.heroTitle}>Events, Workshops & Growth</h1>
        <p className={eventinfocss.heroSubtitle}>
          Discover our upcoming sessions, technical meetups, and milestones
          designed to inspire, connect, and empower every member.
        </p>
      </div>


      <div className={eventinfocss.cardcontainer}>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">All Events</h3>
          {isAdmin && (
            <button
              className={eventinfocss.addbtn}
              onClick={() => {
                setIsEditing(false);
                setFormData({ name: "", description: "" });
                setShowModal(true);
              }}
            >
              + Add Event
            </button>
          )}
        </div>
        {error && <div className="alert alert-danger mb-4">{error}</div>}


        <div className="row">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                description={event.description}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <p style={{ textAlign: 'center', color:'var(--text-main)'}}>No events found.</p>
          )}
        </div>
      </div>


      {showModal && (
        <div className={eventinfocss.modalOverlay}>
          <div className={eventinfocss.modalBox}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold m-0">{isEditing ? "Edit Event" : "Add New Event"}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>

            {formError && (
              <div className="alert alert-danger py-2">{formError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3 text-start">
                <label className="form-label">Event Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div className="mb-3 text-start">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter event description"
                  required
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className={eventinfocss.addbtn}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={eventinfocss.addbtn}
                >
                  {isEditing ? "Save Changes" : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteModal && (
  <div className={eventinfocss.modalOverlay}>
    <div className={eventinfocss.modalBox} style={{ maxWidth: "400px", textAlign: "center" }}>
      <h5 className="fw-bold mb-3">Are you sure?</h5>
      <p className="mb-4">Do you really want to delete this event?</p>
      <div className="d-flex justify-content-center gap-2">
        <button
          type="button"
          className="btn btn-secondary px-4"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-danger px-4"
          onClick={handleDeleteConfirmed}
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}