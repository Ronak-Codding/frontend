import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const adminStr = localStorage.getItem("admin");

  let admin = null;

  try {
    admin = adminStr ? JSON.parse(adminStr) : null;
  } catch {
    localStorage.clear();
    return <Navigate to="/admin/login" replace />;
  }

  if (!token || !admin || admin.role !== "admin") {
    localStorage.clear();
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
