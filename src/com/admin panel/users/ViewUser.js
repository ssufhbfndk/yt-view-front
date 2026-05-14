import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ViewUsers.css";

const ViewUsers = () => {

  const [refreshKey, setRefreshKey] = useState(0);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "danger",
  });

  // =========================
  // FETCH USERS
  // =========================
  useEffect(() => {
    fetchUsers();
  }, [page, limit, status, search, refreshKey]);

  // =========================
  // TOAST
  // =========================
  const showToast = (message, type = "danger") => {

    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "danger",
      });
    }, 3000);

  };


  const getLastActiveText = (time) => {
  if (!time) return "Never";

  const now = new Date();
  const last = new Date(time);

  const diffMs = now - last;

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour ago`;
  return `${diffDay} day ago`;
};

  // =========================
  // API
  // =========================
  const fetchUsers = async () => {

  try {

    setLoading(true);

    let url = "";

    // 🔍 SEARCH API
    if (search && search.trim() !== "") {

      url = `${process.env.REACT_APP_API_URL}/user/search-users`;

    }

    // 📋 NORMAL LIST API
    else {

      url = `${process.env.REACT_APP_API_URL}/user/get-users`;

    }

    const res = await axios.get(url, {
      params: {
        page,
        limit,
        status,
        search: search || "",
      },
    });

    setUsers(res.data.users || []);
    setTotalPages(res.data.totalPages || 1);

  } catch (err) {

    showToast(
      err?.response?.data?.message || "Failed to load users"
    );

  } finally {

    setLoading(false);

  }

};

  // =========================
  // RESET PAGE
  // =========================
  const resetUsers = () => {

    setPage(1);
    setLimit(50);
    setSearch("");
    setStatus("all");

    // FORCE REFRESH
    setRefreshKey((prev) => prev + 1);

  };

  // =========================
  // STATUS CHANGE
  // =========================
  const changeStatus = (val) => {

    setStatus(val);
    setPage(1);

  };

  // =========================
  // PAGINATION
  // =========================
  const nextPage = () => {

    if (page < totalPages) {
      setPage(page + 1);
    }

  };

  const prevPage = () => {

    if (page > 1) {
      setPage(page - 1);
    }

  };

  return (

    <div className="container-fluid user-container mt-4">

      {/* TOAST */}
      {toast.show && (
        <div className={`alert alert-${toast.type} app-toast`}>
          {toast.message}
        </div>
      )}

      <div className="card shadow-lg border-0 rounded-4">

        {/* HEADER */}
        <div className="card-header user-header">

          <div className="header-center">

            <h3
              className="mb-0"
              onClick={resetUsers}
            >
              Users
            </h3>

          </div>

        </div>

        {/* STATUS + SEARCH */}
        <div className="status-tabs">

          {/* LEFT */}
          <div className="tabs-left">

            <button
              className={`tab-btn ${
                status === "all" ? "active-tab" : ""
              }`}
              onClick={() => changeStatus("all")}
            >
              All Users
            </button>

            <button
              className={`tab-btn ${
                status === "1" ? "active-tab" : ""
              }`}
              onClick={() => changeStatus("1")}
            >
              Active
            </button>

            <button
              className={`tab-btn ${
                status === "0" ? "active-tab" : ""
              }`}
              onClick={() => changeStatus("0")}
            >
              Blocked
            </button>

          </div>

          {/* RIGHT */}
          <div className="tabs-right">

            <input
              type="text"
              className="form-control search-input"
              placeholder="Search username / mobile..."
              value={search}
              onChange={(e) => {

                setPage(1);
                setSearch(e.target.value);

              }}
            />

          </div>

        </div>

        {/* TABLE */}
        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover align-middle user-table">

              <thead>

                <tr>

                  <th>Sr No</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Last Active</th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-5"
                    >

                      <div className="spinner-border text-primary"></div>

                      <p className="mt-2 fw-semibold">
                        Loading...
                      </p>

                    </td>
                  </tr>

                ) : users.length > 0 ? (

                  users.map((u, index) => (

                    <tr key={u.id}>

                      {/* SERIAL NUMBER */}
                      <td>
                        {(page - 1) * limit + index + 1}
                      </td>
                        <td>{u.name}</td>


                      <td>{u.username}</td>

                      <td>{u.number}</td>

                      <td>

                        <span
                          className={`badge ${
                            Number(u.status) === 1
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {Number(u.status) === 1
                            ? "Active"
                            : "Blocked"}
                        </span>

                      </td>

                      <td>{u.num_views || 0}</td>

                     <td>{getLastActiveText(u.token_created_at)}</td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="text-center py-5 fw-semibold"
                    >
                      No Users Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">

            {/* LIMIT */}
            <div style={{ minWidth: "100px" }}>

              <select
                className="form-select form-select-sm"
                value={limit}
                onChange={(e) => {

                  setLimit(Number(e.target.value));
                  setPage(1);

                }}
              >

                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>

              </select>

            </div>

            {/* PAGE INFO */}
            <div className="fw-bold text-center">

              Page {page} of {totalPages}

            </div>

            {/* BUTTONS */}
            <div className="d-flex gap-2">

              <button
                className="btn btn-dark"
                onClick={prevPage}
                disabled={page === 1}
              >
                Prev
              </button>

              <button
                className="btn btn-primary"
                onClick={nextPage}
                disabled={page === totalPages}
              >
                Next
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};

export default ViewUsers;