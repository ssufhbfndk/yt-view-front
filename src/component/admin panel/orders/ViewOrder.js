import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ViewOrders.css";

const ViewOrders = () => {
const [totalOrders, setTotalOrders] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [singleDeleteOrder, setSingleDeleteOrder] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "danger",
  });


 const totalQuantity = selectedOrders.reduce(
  (sum, o) => sum + Number(o.quantity || 0),
  0
);

const totalRemaining = selectedOrders.reduce(
  (sum, o) => sum + Number(o.remaining || 0),
  0
);


  // =========================
  // FETCH
  // =========================
  useEffect(() => {
  fetchOrders();
}, [page, limit, status, search, refreshKey]);


  const resetOrders = () => {
  setPage(1);
  setLimit(50);
  setSearch("");
  setStatus("all");
  setSelectedOrders([]);

  // 🔥 FORCE REFRESH (same as Users page)
  setRefreshKey((prev) => prev + 1);
};
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

  // =========================
  // FETCH API
  // =========================
  const fetchOrders = async () => {

    try {

      setLoading(true);
          // 🔥 Purana data clear
    setOrders([]);
    setTotalPages(1);
    setTotalOrders(0);

      let url = "";

      if (search && search.trim() !== "") {

        url = `${process.env.REACT_APP_API_URL}/orders/search-orders`;

      } else {

        url = `${process.env.REACT_APP_API_URL}/orders/get-orders`;

      }

      const res = await axios.get(url, {
        params: {
          page,
          limit,
          status,
          search,
        },
        withCredentials: true, // 🔐 IMPORTANT
      },
      
    );

     setOrders(res.data.orders || []);
setTotalPages(res.data.totalPages || 1);
setTotalOrders(res.data.total || 0);

    } catch (err) {
// 🔥 Error par bhi empty rakho
    setOrders([]);
    setTotalPages(1);
    setTotalOrders(0);
      showToast(
        err?.response?.data?.message || "Failed to load orders"
      );

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // STATUS CHANGE
  // =========================
  const changeStatus = (val) => {

  // agar same tab par click hua
  if (status === val) {

    setPage(1);

    // force refresh
    setRefreshKey(prev => prev + 1);

    return;
  }

  setStatus(val);
  setPage(1);
};

  // =========================
  // CHECKBOX
  // =========================
  const toggleCheckbox = (order) => {
  setSelectedOrders((prev) => {
    const exists = prev.find((o) => o.order_id === order.order_id);

    if (exists) {
      return prev.filter((o) => o.order_id !== order.order_id);
    }

    return [...prev, order];
  });
};

  // =========================
  // SELECT ALL
  // =========================
  const toggleSelectAll = () => {

  const allSelected = orders.every(order =>
    selectedOrders.some(
      selected =>
        selected.order_id === order.order_id
    )
  );

  if (allSelected) {

    setSelectedOrders([]);

  } else {

    setSelectedOrders([...orders]);

  }

};
// =========================
// ROW CLICK DELETE
// =========================
const handleRowDelete = (order) => {

  // 👇 sirf temporary row save
  setSingleDeleteOrder(order);

  // 👇 modal open
  setShowDeleteConfirm(true);

};
  // =========================
  // DELETE MULTIPLE
  // =========================
 const handleDelete = async (ordersToDelete) => {

 if (!ordersToDelete || ordersToDelete.length === 0) {
    showToast("Select orders first");
    return;
  }

  try {

    // 🔥 loading start
    setDeleteLoading(true);

    await axios.post(
      `${process.env.REACT_APP_API_URL}/orders/delete-multiple`,
      {
        orders: ordersToDelete
      },
      {
    withCredentials: true, // 🔐 IMPORTANT
  }
    );

    showToast(
      "Orders deleted successfully",
      "success"
    );

    setSelectedOrders([]);

    await fetchOrders();

  } catch (err) {

    showToast(
      err?.response?.data?.message || "Delete failed"
    );

  } finally {

    // 🔥 loading stop
    setDeleteLoading(false);

  }

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
<>
{
  deleteLoading && (

    <div className="delete-loading-overlay">

      <div className="delete-loading-box">

  <div className="delete-loading-dots">

    <div
      className="spinner-grow"
      role="status"
    ></div>

    <div
      className="spinner-grow"
      role="status"
    ></div>

    <div
      className="spinner-grow"
      role="status"
    ></div>

  </div>

  <p>
    Deleting Orders...
  </p>

</div>

    </div>

  )
}
    <div className="container-fluid order-container mt-4">

      {/* TOAST */}
      {toast.show && (
        <div className={`alert alert-${toast.type} order-toast`}>
          {toast.message}
        </div>
      )}

      <div className="card shadow-lg border-0 rounded-4">

        {/* HEADER */}
        <div className="card-header order-header">

          <div className="header-center">

           <h3
  className="mb-0"
  onClick={resetOrders}
  style={{ cursor: "pointer" }}
>
  Orders
</h3>

          </div>

        </div>

        {/* TABS */}
        <div className="order-tabs-row">

          {/* LEFT */}
          <div className="tabs-left">

            <button
              className={`order-tab-btn ${
                status === "all" ? "active-order-tab" : ""
              }`}
              onClick={() => changeStatus("all")}
            >
              All 
            </button>

            <button
              className={`order-tab-btn ${
                status === "pending" ? "active-order-tab" : ""
              }`}
              onClick={() => changeStatus("pending")}
            >
              Pending
            </button>

            <button
              className={`order-tab-btn ${
                status === "invalid" ? "active-order-tab" : ""
              }`}
              onClick={() => changeStatus("invalid")}
            >
              Invalid
            </button>

            <button
              className={`order-tab-btn ${
                status === "errors" ? "active-order-tab" : ""
              }`}
              onClick={() => changeStatus("errors")}
            >
              Errors
            </button>

            <button
              className={`order-tab-btn ${
                status === "process" ? "active-order-tab" : ""
              }`}
              onClick={() => changeStatus("process")}
            >
              Process 
            </button>

            <button
              className={`order-tab-btn ${
                status === "complete" ? "active-order-tab" : ""
              }`}
              onClick={() => changeStatus("complete")}
            >
              Complete 
            </button>

          </div>

          {/* RIGHT */}
          <div className="tabs-right">

            <input
              type="text"
              className="form-control order-search-input"
              placeholder="Search order id..."
              value={search}
              onChange={(e) => {

                setPage(1);
                setSearch(e.target.value);

              }}
            />

          </div>

        </div>

       {
  selectedOrders.length > 0 ? (

    <div className="selected-action-bar">

      <div className="selected-info">

        <h5>
          {selectedOrders.length} Orders Selected
        </h5>

        <p>
          Quantity: {totalQuantity}
        </p>

        <p>
          Remaining: {totalRemaining}
        </p>

      </div>

      <div className="selected-actions">

        <button
          className="btn btn-danger"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setSelectedOrders([])}
        >
          Cancel
        </button>

      </div>

    </div>

  ) : null
}

        {/* TABLE */}
        <div className="card-body">

          <div className="table-responsive">

            <table className="table table-hover align-middle order-table">

              <thead>

                <tr>

                  <th>

                    <input
                      type="checkbox"
                      checked={
  orders.length > 0 &&
  orders.every(order =>
    selectedOrders.some(
      selected =>
        selected.order_id === order.order_id
    )
  )
}
                      onChange={toggleSelectAll}
                    />

                  </th>

                  <th>Sr No</th>
                  <th>Order ID</th>
                  <th>Video Link</th>
                  <th>Quantity</th>
                  <th>Remaining</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Reason</th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="10"
                      className="text-center py-5"
                    >

                      <div className="spinner-border text-primary"></div>

                      <p className="mt-2 fw-semibold">
                        Loading...
                      </p>

                    </td>

                  </tr>

                ) : orders.length > 0 ? (

                  orders.map((o, index) => (

                    <tr
                            key={o.order_id}
                            onClick={() => handleRowDelete(o)}
                            style={{ cursor: "pointer" }}
                          >

                      <td>

                        <input
                          type="checkbox"
                      
                         onClick={(e) => e.stopPropagation()}
                         onChange={() => toggleCheckbox(o)}
                        checked={selectedOrders.some((x) => x.order_id === o.order_id)}
                        />

                      </td>

                      <td>
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td
  onClick={(e) => {
    e.stopPropagation();

    navigator.clipboard.writeText(o.order_id);

    showToast(
      `Copied: ${o.order_id}`,
      "success"
    );
  }}
  style={{
    cursor: "pointer",
    fontWeight: "600"
  }}
>
  {o.order_id}
</td>

                      <td>

                        <a
                            href={o.video_link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open Video
                          </a>

                      </td>

                      <td>{o.quantity}</td>

                      <td>{o.remaining}</td>

                      <td>{o.duration}</td>
                      <td>
  <span
    className={`badge ${
      o.status === "pending"
        ? "bg-warning text-dark"
        : o.status === "invalid"
        ? "bg-danger"
        : o.status === "errors"
        ? "bg-danger"
        : o.status === "process"
        ? "bg-info text-dark"
        : o.status === "complete"
        ? "bg-success"
        : "bg-secondary"
    }`}
  >
    {o.status}
  </span>
</td>

                      <td>{o.type}</td>

                      <td>{o.reason || "-"}</td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="10"
                      className="text-center py-5 fw-semibold"
                    >
                      No Orders Found
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

                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>

              </select>

            </div>

            {/* PAGE */}
           <div className="fw-bold text-center">
  Page {page} of {totalPages} | Total Orders: {totalOrders}
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
    {
  showDeleteConfirm && (

    <div className="custom-delete-modal">

      <div className="delete-modal-box">

        <h4>
          Delete Selected Orders?
        </h4>

        <p>
          This action cannot be undone.
        </p>

        <div className="delete-modal-actions">

          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            No
          </button>

          <button
            className="btn btn-danger"
         onClick={() => {

  setShowDeleteConfirm(false);

  // 👇 agar row click delete hai
  if (singleDeleteOrder) {

    handleDelete([singleDeleteOrder]);

    setSingleDeleteOrder(null);

  }

  // 👇 checkbox multi delete
  else {

    handleDelete(selectedOrders);

  }

}}
          >
            Yes Delete
          </button>

        </div>

      </div>

    </div>

  )
}
</>
  );

};

export default ViewOrders;