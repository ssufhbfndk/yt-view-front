import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "datatables.net-bs5";
import $ from "jquery";
import "datatables.net-responsive-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import "./ViewOrders.css";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchOrders();

    return () => {
      // Destroy DataTable on unmount
      if ($.fn.DataTable.isDataTable("#orderTable")) {
        $("#orderTable").DataTable().destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      initializeDataTable();
    }

    // Reapply styles after React re-renders
    const reapplyStyles = () => {
      $("#orderTable thead th").css({
        backgroundColor: "#007bff",
        color: "white",
        textAlign: "center",
        padding: "12px",
        fontSize: "16px",
      });

      $("#orderTable tbody td").css({
        textAlign: "center",
        verticalAlign: "middle",
        padding: "10px",
        fontSize: "14px",
      });
    };

    reapplyStyles();
  }, [orders]);

  const fetchOrders = async () => {
    try {
      // Destroy DataTable before fetching new data
      if ($.fn.DataTable.isDataTable("#orderTable")) {
        $("#orderTable").DataTable().destroy();
      }

      const response = await axios.get("http://localhost:5000/api/orders/ordersData");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("Failed to load orders.", "danger");
    }
  };

  const initializeDataTable = () => {
    setTimeout(() => {
      $("#orderTable").DataTable({
        responsive: true,
        paging: true,
        autoWidth: false,
        scrollX: true,
        searching: true,
        ordering: true,
        destroy: true,
        drawCallback: function () {
          // Reapply custom styles after every table redraw
          $("#orderTable thead th").css({
            backgroundColor: "#007bff",
            color: "white",
            textAlign: "center",
            padding: "12px",
            fontSize: "16px",
          });

          $("#orderTable tbody td").css({
            textAlign: "center",
            verticalAlign: "middle",
            padding: "10px",
            fontSize: "14px",
          });
        },
      });
    }, 300);
  };

  const deleteOrder = async () => {
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/ordersData/${confirmDelete.order_id}`, {
        data: { table: confirmDelete.tableName },
      });

      showToast("Order deleted successfully!", "success");

      setConfirmDelete(null); // Close modal properly
      fetchOrders(); // Fetch new data after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
      showToast("Failed to delete order.", "danger");
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 5000); // 5 seconds
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">View Orders</h2>

      {/* Orders Table */}
      <div className="table-responsive">
        <table id="orderTable" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Video Link</th>
              <th>Quantity</th>
              <th>Remaining</th>
              <th>Source Table</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>
                    <a href={order.video_link} target="_blank" rel="noopener noreferrer" className="video-link">
                      View Video
                    </a>
                  </td>
                  <td>{order.quantity}</td>
                  <td>{order.remaining}</td>
                  <td>{order.tableName}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(order)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No orders available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="alert-box">
          <div className={`alert alert-${toast.type}`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setConfirmDelete(null)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete Order ID <b>{confirmDelete.order_id}</b>?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={deleteOrder}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrders;