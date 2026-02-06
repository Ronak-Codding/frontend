import React from "react";

const AirlineModal = ({ show, onClose, onSubmit, form, setForm, editId }) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "#00000080" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">
              {editId ? "Edit Airline" : "Add New Airline"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Airline Name</label>
                <input
                  className="form-control"
                  value={form.airline_name}
                  onChange={(e) =>
                    setForm({ ...form, airline_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Airline Code</label>
                <input
                  className="form-control"
                  value={form.airline_code}
                  onChange={(e) =>
                    setForm({ ...form, airline_code: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Publish">Publish</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AirlineModal;
