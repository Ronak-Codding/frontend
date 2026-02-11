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
      console.error(err);
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
      loadContacts();
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

  if (loading) return <p className="p-6">Loading contacts...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">📩 Contact Messages</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 m-4">
        <input
          className="border rounded-lg px-3 py-2 w-full placeholder-gray-500  md:w-1/3"
          placeholder="Search by email or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">No</th>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No messages found
                </td>
              </tr>
            )}

            {filteredContacts.map((c, i) => (
              <tr key={c._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">{c.fullName}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.subject || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer
                      ${
                        c.status === "new"
                          ? "bg-yellow-500 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    onClick={() => toggleStatus(c._id)}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => handleView(c)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => deleteContact(c._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW MODAL */}
      {viewContact && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden border border-black dark:border-white">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-black dark:border-white">
              <h2 className="text-lg sm:text-xl font-semibold text-black dark:text-white">
                Contact Message
              </h2>
              <button
                onClick={() => setViewContact(null)}
                className="text-2xl text-black dark:text-white hover:opacity-70"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-4 text-sm sm:text-base text-black dark:text-white">
              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                <Detail label="Name" value={viewContact.fullName} />
                <Detail label="Email" value={viewContact.email} />
                <Detail label="Phone" value={viewContact.phone || "-"} />
                <Detail label="Subject" value={viewContact.subject || "-"} />
              </div>

              {/* Message */}
              <div>
                <p className="font-medium mb-1 text-black dark:text-white">
                  Message
                </p>
                <div className="bg-gray-100 dark:bg-gray2800 border border-black dark:border-white rounded-lg p-3 whitespace-pre-wrap">
                  {viewContact.message}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-5 py-4 border-t border-black dark:border-white">
              <button
                onClick={() => setViewContact(null)}
                className="
            px-6 py-2 rounded-lg
            border border-black dark:border-white
            bg-white dark:bg-black
            text-black dark:text-white
            hover:opacity-70
          "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-medium text-black dark:text-white">{label}</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default AdminContacts;
