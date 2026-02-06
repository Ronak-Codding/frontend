import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // fixed
  const userStr = localStorage.getItem("user");

  let user = null;

  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (!token || !user || user.role !== "user") {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserRoute;
