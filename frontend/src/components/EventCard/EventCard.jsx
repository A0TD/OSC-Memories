import React from "react";
import { Link } from "react-router-dom";
import eventcardvss from "./EventCard.module.css";

export default function EventCard({ id, name, description, isAdmin, onDelete, onEdit }) {
  return (
    <div className="col-md-4 mb-4">
      <div className={`card h-100 py-4  d-flex flex-column justify-content-between ${eventcardvss.eventCard}`}>
        <div>
          <h5 className={eventcardvss.eventTitle}>{name}</h5>
          <p className={eventcardvss.eventDescription}>{description}</p>
        </div>



          {isAdmin && (
            <div className="d-flex gap-2">
              <button 
                className={eventcardvss.editBtn} 
                onClick={() => onEdit(id)}
              >
                Edit
              </button>
              <button 
                className={eventcardvss.deleteBtn} 
                onClick={() => onDelete(id)}
              >
                Delete
              </button>
            </div>
          )}
        
      </div>
    </div>
  );
}