import React ,{useState} from "react";
import icondelete from "../../assets/images/icons8-delete-100.png";
import membercss from "./MemberCard.module.css";

export default function MemberCard({ member, onToggleRole, onDelete }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const firstLetter = member.name ? member.name.charAt(0).toUpperCase() : "?";
  const colorClasses = [
    membercss.avatarColor0,
    membercss.avatarColor1,
    membercss.avatarColor2,
    membercss.avatarColor3,
    membercss.avatarColor4,
    membercss.avatarColor5,
  ];

  const colorIndex =
    (member.id
      ? member.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : 0) % colorClasses.length;
  const randomBgClass = colorClasses[colorIndex];

  return (
    <div className="container-fluid">
      <div className= {` d-flex justify-content-between align-items-center  col-12 d-lg-none border-bottom ${membercss.memberCardBox}`}>
          <div className="d-flex align-items-center gap-3">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${randomBgClass} ${membercss.image}`}
            >
              {firstLetter}
            </div>
            <p className={` mb-0 ${membercss.name}`}>{member.name}</p>
          </div>

          <button
            className="btn btn-sm btn-outline-warning py-1 px-2"
            style={{ fontSize: "12px", height: "fit-content" }}
            onClick={() => setShowDetailsModal(true)}
          >
            Read More
          </button>
        </div>
      
      <div
        className={` row d-none d-lg-flex align-content-center justify-content-between border-bottom ${membercss.memberCardBox}`}
      >
        <div className="d-flex justify-content-around align-items-center gap-5 col-12 col-md-6 ">
          <div className=" d-flex align-content-center  gap-3 ">
            <div
              className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${randomBgClass} ${membercss.image}`}
            >
              {firstLetter}
            </div>
            <p className={` pt-2 ${membercss.name}`}>{member.name}</p>
          </div>
          <div className={` pt-2 ${membercss.email}`}>
            <p>{member.email} </p>
          </div>
        </div>
        <div className="d-flex justify-content-around gap-5  align-items-center col-12 col-md-6 ">
          <div className="d-flex align-items-center ">
            <p className={membercss.rolew}>Role: </p>
            <p className={membercss.rolemember}>{member.role}</p>
          </div>
          <div className="d-flex gap-3  ">
            <button
              className={`btn  ${member.role === "Admin" ? "btn-outline-danger" : "btn-outline-warning"} ${membercss.btnadmin}`}
              onClick={() => onToggleRole(member.id)}
            >
              {member.role === "Admin" ? "Remove Admin" : "Make Admin"}
            </button>

            <button
              className={`btn btn-sm btn-outline-danger ${membercss.btndelete}`}
              onClick={() => onDelete(member.id)}
              title="Delete Member"
            >
              <img src={icondelete} alt="Delete" width="20" height="20" />
            </button>
          </div>
        </div>
      </div>
      {showDetailsModal && (
        <div
          className={`position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center ${membercss.modalOverlay}`}
          
        >
          <div
            className={`card p-4 shadow-lg border-0 text-start ${membercss.modalContent}`}
          >
            <h4 className="fw-bold mb-3" style={{ color: "var(--brand-orange)" }}>
              Member Details
            </h4>
            <p className="mb-2"><strong>Name:</strong> {member.name}</p>
            <p className="mb-2"><strong>Email:</strong> {member.email}</p>
            <p className="mb-3">
              <strong>Role:</strong> <span className="text-warning">{member.role}</span>
            </p>

            <div className="d-flex flex-column gap-2 mt-3">
              <button
                className={`btn btn-sm ${member.role === "Admin" ? "btn-outline-danger" : "btn-outline-warning"}`}
                onClick={() => {
                  onToggleRole(member.id);
                  setShowDetailsModal(false);
                }}
              >
                {member.role === "Admin" ? "Remove Admin" : "Make Admin"}
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  onDelete(member.id);
                  setShowDetailsModal(false);
                }}
              >
                Delete Member
              </button>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-secondary btn-sm px-4"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
