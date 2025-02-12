import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5";
import $ from "jquery";
import "datatables.net-responsive-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import "./ComOrder.css";

const CompleteOrder = () => {
  const [orders, setOrders] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchOrders();
    return () => {
      if ($.fn.DataTable.isDataTable("#orderTable")) {
        $("#orderTable").DataTable().destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      initializeDataTable();
      applyStyles();
    }
  }, [orders]);

  const fetchOrders = async () => {
    try {
      if ($.fn.DataTable.isDataTable("#orderTable")) {
        $("#orderTable").DataTable().destroy();
      }
      const response = await axios.get("http://localhost:5000/api/orders/ordersComplete");
      setOrders(response.data.orders);
    } catch (error) {
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
        drawCallback: applyStyles,
      });
    }, 300);
  };

  const applyStyles = () => {
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

  const deleteOrder = async () => {
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:5000/api/orders/deleteOrderComplete/${confirmDelete}`);
      
      showToast("Order deleted successfully!", "success");
      setConfirmDelete(null); // Modal close karna
  
      // ✅ Order delete hone ke baad fresh data fetch karo
      await fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      showToast("Failed to delete order.", "danger");
    }
  };
  
  

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 5000);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 text-center">Complete Orders</h2>

      {/* Toast Notification */}
        {toast.show && (
        <div className={`alert alert-${toast.type} toast-alert`}>
          {toast.message}
        </div>
        )}

      <div className="table-responsive">
        <table id="orderTable" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Order ID</th>
              <th>Video Link</th>
              <th>Quantity</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.order_id}</td>
                  <td>
                    <a href={order.video_link} target="_blank" rel="noopener noreferrer" className="video-link">
                      View Video
                    </a>
                  </td>
                  <td>{order.quantity}</td>
                  <td>{new Date(order.timestamp).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteModal"
                      onClick={() => setConfirmDelete(order.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No orders available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bootstrap Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setConfirmDelete(null)}></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this order?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteOrder}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteOrder;
