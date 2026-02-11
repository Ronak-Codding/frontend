import React from "react";

const AirlineModal = ({ show, onClose, onSubmit, form, setForm, editId }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>

      {/* Modal */}
      <div
        className="relative w-full max-w-md p-6 rounded-xl shadow-xl
                      bg-white dark:bg-black
                      border border-black dark:border-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-black dark:border-white pb-3">
          <h5 className="text-lg font-semibold text-black dark:text-white">
            {editId ? "Edit Airline" : "Add New Airline"}
          </h5>
          <button
            onClick={onClose}
            className="text-black dark:text-white hover:opacity-70 text-lg"
          >
            ✖
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Airline Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              Airline Name
            </label>
            <input
              type="text"
              className="
                w-full h-9 px-3 rounded-lg
                border border-black dark:border-white
                bg-white dark:bg-black
                text-black dark:text-white
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
              value={form.airline_name}
              onChange={(e) =>
                setForm({ ...form, airline_name: e.target.value })
              }
              required
            />
          </div>

          {/* Airline Code */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              Airline Code
            </label>
            <input
              type="text"
              className="
                w-full h-9 px-3 rounded-lg
                border border-black dark:border-white
                bg-white dark:bg-black
                text-black dark:text-white
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
              value={form.airline_code}
              onChange={(e) =>
                setForm({ ...form, airline_code: e.target.value })
              }
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black dark:text-white">
              Status
            </label>
            <select
              className="
                w-full h-9 px-3 rounded-lg
                border border-black dark:border-white
                bg-white dark:bg-black
                text-black dark:text-white
                focus:ring-2 focus:ring-black dark:focus:ring-white
                outline-none
              "
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Publish">Publish</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-black dark:border-white">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 rounded-lg
                border border-black dark:border-white
                bg-white dark:bg-black
                text-black dark:text-white
                hover:opacity-70
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                px-4 py-2 rounded-lg
                bg-blue-600 dark:bg-blue-500
                text-white dark:text-black
                hover:opacity-80
              "
            >
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AirlineModal;
