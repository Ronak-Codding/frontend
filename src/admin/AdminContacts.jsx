import React, { useEffect, useState } from "react";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewContact, setViewContact] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadContacts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contact/allContact");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error("Fetch contacts error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleView = async (contact) => {
    setViewContact(contact);

    if (contact.status === "new") {
      await fetch(`http://localhost:5000/api/contact/${contact._id}/status`, {
        method: "PUT",
      });
      loadContacts(); // refresh list & sidebar badge
    }
  };

  const toggleStatus = async (id) => {
    await fetch(`http://localhost:5000/api/contact/${id}/status`, {
      method: "PUT",
    });
    loadContacts();
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    await fetch(`http://localhost:5000/api/contact/deleteContact/${id}`, {
      method: "DELETE",
    });
    loadContacts();
  };

  const filteredContacts = contacts.filter((c) => {
    const matchSearch =
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.subject || "").toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "" || c.status === statusFilter;

    return matchSearch && matchStatus;
  });

  if (loading) return <p>Loading contacts...</p>;

  return (
    <>
      <h3 className="mb-4">📩 Contact Messages</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Search by email or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      <table className="table table-hover shadow bg-white">
        <thead className="fs-5">
          <tr>
            <th>No</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Status</th>
            <th className="w-40">Action</th>
          </tr>
        </thead>

        <tbody>
          {contacts.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No messages found
              </td>
            </tr>
          )}

          {filteredContacts.map((c, i) => (
            <tr key={c._id}>
              <td>{i + 1}</td>
              <td>{c.fullName}</td>
              <td>{c.email}</td>
              <td>{c.subject || "-"}</td>
              <td>
                <span
                  className={`badge ${
                    c.status === "new" ? "bg-warning" : "bg-success"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleStatus(c._id)}
                >
                  {c.status}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => handleView(c)}
                >
                  <i className="fas fa-eye"></i>
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteContact(c._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {viewContact && (
        <div
          className="modal fade show d-block"
          style={{ background: "#00000080" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Contact Message</h5>
                <button
                  className="btn-close"
                  onClick={() => setViewContact(null)}
                />
              </div>

              <div className="modal-body">
                <p>
                  <strong>Name:</strong> {viewContact.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {viewContact.email}
                </p>
                <p>
                  <strong>Phone:</strong> {viewContact.phone || "-"}
                </p>
                <p>
                  <strong>Subject:</strong> {viewContact.subject || "-"}
                </p>
                <hr />
                <p>
                  <strong>Message:</strong>
                </p>
                <p>{viewContact.message}</p>
              </div>
              {/* <a
                href={`mailto:${viewContact.email}?subject=Re: ${viewContact.subject}`}
                className="btn btn-primary"
              >
                <i className="fas fa-reply me-1"></i> Reply by Email
              </a> */}

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewContact(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminContacts;
