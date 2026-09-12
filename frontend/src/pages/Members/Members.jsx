import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import MemberCard from "../../components/MemberCard/MemberCard";
import Pagination from "../../components/Pagination/Pagination";
import memberscss from "./Members.module.css";
import { Search } from "lucide-react";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/users");
      const data = response.data;
      setMembers(data.users || data.data?.users || data.data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (id) => {
    try {
      const response = await api.patch(`/users/${id}/role`);

      if (response.data && response.data.success !== false) {
        setMembers((prevMembers) =>
          prevMembers.map((m) => {
            const currentId = m.id || m._id;
            if (currentId === id) {
              const newRole = m.role === "Admin" ? "Member" : "Admin";
              return { ...m, role: newRole };
            }
            return m;
          }),
        );
      }
    } catch (err) {
      console.error("Failed to toggle role", err);
    }
  };

  const confirmDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      const response = await api.delete(`/users/${userToDelete}`);

      if (response.data && response.data.success !== false) {
        setMembers((prevMembers) =>
          prevMembers.filter((m) => (m.id || m._id) !== userToDelete),
        );
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const filteredMembers = members.filter((member) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const usernameLower = (member.username || "").toLowerCase();
    const emailLower = (member.email || "").toLowerCase();

    if (!searchLower) {
      if (activeFilter === "Members") return member.role === "Member";
      if (activeFilter === "Admins") return member.role === "Admin";
      return true;
    }

    const matchesSearch =
      usernameLower.startsWith(searchLower) ||
      emailLower.startsWith(searchLower);

    if (activeFilter === "Members")
      return matchesSearch && member.role === "Member";
    if (activeFilter === "Admins")
      return matchesSearch && member.role === "Admin";
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <>
      <section className={memberscss.home}>
        <h1>Our Members</h1>
        <p>Manage OSC Members and Administrators.</p>
      </section>
      <div className={`container-fluid p-4 p-md-5 ${memberscss.pageContainer}`}>
        <div className="max-w-6xl mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className={`h3 ${memberscss.title}`}>Members Management</h1>
          </div>

          <div className="row g-3 align-items-center justify-content-between mb-4">
            <div className="col-12 col-md-6 position-relative">
              <Search
                className="position-absolute text-muted"
                size={18}
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  left: "25px",
                }}
              />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`form-control ps-5 ${memberscss.searchBox}`}
              />
            </div>

            <div className="col-12 col-md-auto">
              <div
                className={`d-flex align-items-center gap-1 ${memberscss.filterContainer}`}
              >
                {["All", "Members", "Admins"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      setCurrentPage(1);
                    }}
                    className={`${memberscss.filterBtn} ${activeFilter === filter ? memberscss.filterBtnActive : ""}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={memberscss.tableBox}>
            {loading ? (
              <p className="text-center py-5 text-muted">Loading members...</p>
            ) : error ? (
              <p className="text-center py-5 text-danger">{error}</p>
            ) : currentMembers.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {currentMembers.map((member) => {
                  const memberId = member.id || member._id;
                  return (
                    <MemberCard
                      key={memberId}
                      member={{
                        ...member,
                        id: memberId,
                        name: member.username,
                      }}
                      onToggleRole={handleToggleRole}
                      onDelete={confirmDelete}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-5 text-muted">No members found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>

        {showDeleteModal && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 1050 }}
          >
            <div
              className="card p-4 text-center shadow-lg border-0"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)",
                width: "380px",
                borderRadius: "16px",
              }}
            >
              <h3
                className="fw-bold mb-2"
                style={{ color: "var(--hero-title-color)" }}
              >
                Are you sure?
              </h3>
              <p className="mb-4 text-muted">
                Do you really want to delete this member?
              </p>
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn btn-secondary px-4 py-2"
                  onClick={() => setShowDeleteModal(false)}
                  style={{ borderRadius: "8px" }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger px-4 py-2"
                  onClick={handleDelete}
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#e53e3e",
                    border: "none",
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
