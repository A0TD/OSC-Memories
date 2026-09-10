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
  
  // States جديدة عشان نعرف إحنا في وضع تعديل ولا إضافة، ونحفظ الـ ID بتاع الإيفنت اللي بنعدله
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  

  const { request, loading, error } = useApi();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

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

const handleDelete = async (id) => {
   
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    
    if (!confirmed) return; 

    try {
      await request({ method: "DELETE", url: `/event-infos/${id}` });
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  // تعديل دالة الـ handleEdit عشان تفتح المودال وتعبي البيانات القديمة
  const handleEdit = (id) => {
    const eventToEdit = events.find((event) => event.id === id);
    if (eventToEdit) {
      setFormData({ name: eventToEdit.name, description: eventToEdit.description });
      setEditEventId(id);
      setIsEditing(true);
      setShowModal(true);
    }
  };

  // التعامل مع إدخال الفورم
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // إرسال البيانات للباك إند (POST للإضافة أو PUT للتعديل)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.description.trim()) {
      setFormError("All fields are required.");
      return;
    }

    try {
      if (isEditing) {
        // طلب التعديل (PUT)
        const response = await request({
          method: "PUT",
          url: `/event-infos/${editEventId}`,
          data: formData,
        });
        
        const updatedEvent = response.data?.eventInfo || response.data;
        setEvents(events.map((ev) => (ev.id === editEventId ? updatedEvent : ev)));
      } else {
        // طلب الإضافة (POST)
        const response = await request({
          method: "POST",
          url: "/event-infos",
          data: formData,
        });

        const newEvent = response.data?.eventInfo || response.data;
        setEvents([newEvent, ...events]);
      }

      // قفل الـ Modal وتفريغ الفورم وإعادة الحالات لوضعها الأصلي
      closeModal();
    } catch (err) {
      console.error("Failed to save event", err);
      setFormError(err.response?.data?.message || "Failed to save event.");
    }
  };

  // دالة لإغلاق المودال وتصفير البيانات
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
      {/* Hero Section */}
      <div className={eventinfocss.heroSection}>
        <h1 className={eventinfocss.heroTitle}>Events, Workshops & Growth</h1>
        <p className={eventinfocss.heroSubtitle}>
          Discover our upcoming sessions, technical meetups, and milestones
          designed to inspire, connect, and empower every member.
        </p>
      </div>

      {/* المحتوى جوه الـ Container */}
      <div className={eventinfocss.cardcontainer}>
        {/* Header & Add Button */}
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

        {/* Events Grid */}
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

      {/* Modal نافذة إضافة أو تعديل إيفنت */}
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
    </div>
  );
}