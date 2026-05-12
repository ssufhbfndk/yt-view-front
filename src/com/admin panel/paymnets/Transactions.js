import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Transactions.css";

const Transactions = () => {

  const [transactions, setTransactions] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

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
  // TOAST
  // =========================
  const showToast = (message, type = "danger") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "danger" });
    }, 3000);
  };

  // =========================
  // FETCH API (ONLY ONE SOURCE)
  // =========================
  const fetchTransactions = async () => {
  try {
    setTableLoading(true);

    let url = "";
      
    // 👉 IF SEARCH EXISTS → use search API
    if (search && search.trim() !== "") {
      url = `${process.env.REACT_APP_API_URL}/payment/transactions-search`;
    } 
    // 👉 OTHERWISE NORMAL API
    else {
      url = `${process.env.REACT_APP_API_URL}/payment/transactions-view`;
    }

    const response = await axios.get(url, {
      params: {
        page,
        limit,
        search: search || "",
        status,
      },
    });

    setTransactions(response.data.transactions || []);
    setTotalPages(response.data.totalPages || 1);

  } catch (error) {
    showToast(error?.response?.data?.message || "Failed to load transactions");
  } finally {
    setTableLoading(false);
  }
};
  // =========================
  // SINGLE CONTROLLED EFFECT
  // =========================
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTransactions();
    }, search ? 500 : 0); // debounce only for search

    return () => clearTimeout(timeout);
  }, [page, limit, status, search]);

  // =========================
  // RESET
  // =========================
  const resetTransactions = () => {
    setPage(1);
    setLimit(50);
    setSearch("");
    setStatus("all");
  };

  // =========================
  // PAGINATION
  // =========================
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // =========================
  // STATUS CHANGE
  // =========================
  const changeStatus = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  return (
    <div className="container-fluid transaction-container mt-4">

      {/* TOAST */}
      {toast.show && (
        <div className={`alert alert-${toast.type} custom-toast`}>
          {toast.message}
        </div>
      )}

      <div className="card shadow-lg border-0 rounded-4">

        {/* HEADER */}
        <div className="card-header transaction-header">
          <div className="header-center">
            <h3 className="mb-0" onClick={resetTransactions}>
              Transactions
            </h3>
          </div>
        </div>

        {/* STATUS TABS */}
        <div className="status-tabs d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div className="d-flex flex-wrap gap-2">

            <button
              className={`tab-btn ${status === "all" ? "active-tab" : ""}`}
              onClick={() => changeStatus("all")}
            >
              All Transactions
            </button>

            <button
              className={`tab-btn ${status === "pending" ? "active-tab" : ""}`}
              onClick={() => changeStatus("pending")}
            >
              Pending
            </button>

            <button
              className={`tab-btn ${status === "completed" ? "active-tab" : ""}`}
              onClick={() => changeStatus("completed")}
            >
              Completed
            </button>

            <button
              className={`tab-btn ${status === "rejected" ? "active-tab" : ""}`}
              onClick={() => changeStatus("rejected")}
            >
              Rejected
            </button>

          </div>

          <div className="header-right">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search username or transaction id..."
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

            <table className="table table-hover align-middle transaction-table">

              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Username</th>
                  <th>Bank Name</th>
                  <th>Account No</th>
                  <th>Holder Name</th>
                  <th>Coins</th>
                  <th>PKR</th>
                  <th>USD</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Updated</th>
                </tr>
              </thead>

              <tbody>

                {tableLoading ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5">
                      <div className="spinner-border text-primary"></div>
                      <p className="mt-2">Loading...</p>
                    </td>
                  </tr>
                ) : transactions.length > 0 ? (
                  transactions.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.username}</td>
                      <td>{item.bank_name}</td>
                      <td>{item.bank_account_number}</td>
                      <td>{item.account_holder_name}</td>
                      <td>{item.coins}</td>
                      <td>Rs {item.amount_pkr}</td>
                      <td>$ {item.amount_usd}</td>
                      <td>
                        <span
  className={`badge ${
    Number(item.status) === 0
      ? "bg-warning text-dark"
      : Number(item.status) === 1
      ? "bg-success"
      : Number(item.status) === 2
      ? "bg-danger"
      : "bg-secondary"
  }`}
>
  {Number(item.status) === 0
    ? "Pending"
    : Number(item.status) === 1
    ? "Completed"
    : Number(item.status) === 2
    ? "Rejected"
    : "Unknown"}
</span>
                      </td>
                      <td>{new Date(item.created_at).toLocaleString()}</td>
                      <td>
  {item.updated_at
    ? new Date(item.updated_at).toLocaleString()
    : "Not updated yet"}
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-5">
                      No Transactions Found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* PAGINATION */}
          <div className="d-flex justify-content-between align-items-center mt-3">

            <div>
              <select
                className="form-select"
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

            <div>
              Page {page} of {totalPages}
            </div>

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

export default Transactions;