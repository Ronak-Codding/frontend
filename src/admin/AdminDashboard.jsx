import React, { useEffect, useState } from "react";
import UserGrowthChart from "./UserGrowthChart";
import "./Admin.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/user/allusers")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <>
      <h3 className="my-4">Dashboard</h3>

      <div className="row g-3">
        <div className="col-md-3">
          <div className="p-3 bg-white shadow rounded">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-8">
            <UserGrowthChart />
          </div>
        </div>
        {/* <div className="col-md-3">
          <div className="p-3 bg-white shadow rounded">
            <h3>{users.filter((u) => u.status === "active").length}</h3>
            <p>Active</p>
          </div>
        </div> */}

        {/* <div className="col-md-3">
          <div className="p-3 bg-white shadow rounded">
            <h3>{users.filter((u) => u.status === "blocked").length}</h3>
            <p>Blocked</p>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default AdminDashboard;
