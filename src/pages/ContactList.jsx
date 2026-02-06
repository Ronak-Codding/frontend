import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact");
      setContacts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching contacts", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    await axios.delete(`http://localhost:5000/api/contact/${id}`);
    fetchContacts();
  };

  const handleEditClick = (contact) => {
    setEditData({ ...contact });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:5000/api/contact/${editData._id}`,
      editData
    );
    setEditData(null);
    fetchContacts();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const statusColor = (status) => {
    if (status === "New") return "bg-blue-100 text-blue-700";
    if (status === "Read") return "bg-yellow-100 text-yellow-700";
    if (status === "Resolved") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        📩 Contact Messages
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Message</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {contacts.map((c, index) => (
                <tr
                  key={c._id}
                  className={`text-sm ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-50 transition`}
                >
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3 text-center">{c.phone}</td>
                  <td className="p-3 text-center">{c.subject}</td>
                  <td className="p-3 max-w-xs truncate">{c.message}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEditClick(c)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteContact(c._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="font-bold text-xl mb-4">✏️ Edit Contact</h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              {["name", "email", "phone", "subject"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={editData[field]}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                  placeholder={field.toUpperCase()}
                />
              ))}

              <textarea
                name="message"
                value={editData.message}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                placeholder="Message"
              />

              <select
                name="status"
                value={editData.status}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              >
                <option value="New">New</option>
                <option value="Read">Read</option>
                <option value="Resolved">Resolved</option>
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditData(null)}
                  className="bg-gray-300 px-4 py-1 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
