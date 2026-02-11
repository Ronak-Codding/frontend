import React from "react";

const AirlineModal = ({ show, onClose, onSubmit, form, setForm, editId }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-lg font-semibold text-gray-800">
            {editId ? "Edit Airline" : "Add New Airline"}
          </h5>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✖
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Airline Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Airline Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.airline_name}
              onChange={(e) =>
                setForm({ ...form, airline_name: e.target.value })
              }
              required
            />
          </div>

          {/* Airline Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Airline Code
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.airline_code}
              onChange={(e) =>
                setForm({ ...form, airline_code: e.target.value })
              }
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="Publish">Publish</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
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
