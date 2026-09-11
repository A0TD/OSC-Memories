import React from "react";
import icondelete from "../../assets/images/icons8-delete-100.png";
import membercss from "./MemberCard.module.css";



export default function MemberCard({member, onToggleRole, onDelete }) {

  const firstLetter = member.name ? member.name.charAt(0).toUpperCase() : "?";
  const colorClasses = [
    membercss.avatarColor0,
    membercss.avatarColor1,
    membercss.avatarColor2,
    membercss.avatarColor3,
    membercss.avatarColor4,
    membercss.avatarColor5,
  ];

  const colorIndex = (member.id ? member.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0) % colorClasses.length;
  const randomBgClass = colorClasses[colorIndex];

  return (
    <div className="container-fluid">
        <div
      className={` row d-flex align-content-center justify-content-between border-bottom ${membercss.memberCardBox}`}
    >
      
      <div className="d-flex justify-content-around align-items-center gap-5 col-12 col-md-6 ">
        <div className=" d-flex align-content-center  gap-3 ">
        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${randomBgClass} ${membercss.image}`}>
              {firstLetter}
            </div>
        <p className={` pt-2 ${membercss.name}`}>{member.name}</p>
      </div>
      <div className={` pt-2 ${membercss.email}`}>
        <p>{member.email} </p>
      </div>
      </div>
      <div className="d-flex justify-content-around gap-5  align-items-center col-12 col-md-6 ">
        <div
        className="d-flex align-items-center "
      >
        <p className={membercss.rolew}>Role: </p>
        <p className={membercss.rolemember}>{member.role}</p>
      </div>
      <div className="d-flex gap-3  " >
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
    </div>
  );
}
