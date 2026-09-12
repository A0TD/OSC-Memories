import eventcardvss from "./EventCard.module.css";

export default function EventCard({
  id,
  name,
  description,
  isAdmin,
  onDelete,
  onEdit,
  onReadMore,
}) {
  return (
    <div className="col-md-4 mb-4">
      <div
        className={`card py-4 d-flex flex-column justify-content-between ${eventcardvss.eventCard}`}
      >
        <div>
          <h5 className={eventcardvss.eventTitle}>{name}</h5>
          <p className={eventcardvss.eventDescription}>{description}</p>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 px-3">
          {isAdmin ? (
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
          ) : (
            <div></div>
          )}

          <button className="btn btn-sm  fw-bold  " onClick={onReadMore}>
            Read More &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
