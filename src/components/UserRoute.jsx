import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const token = localStorage.getItem("usertoken");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(userStr);
  } catch {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserRoute;

// import { Navigate } from "react-router-dom";

// const UserRoute = ({ children }) => {
//   const token = localStorage.getItem("usertoken"); // fixed
//   const userStr = localStorage.getItem("user");

//   let user = null;

//   try {
//     user = userStr ? JSON.parse(userStr) : null;
//   } catch {
//     localStorage.clear();
//     return <Navigate to="/login" replace />;
//   }

//   if (!token || !user || user.role !== "user") {
//     // localStorage.clear();
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default UserRoute;
