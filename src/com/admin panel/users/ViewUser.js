import React, { useState, useEffect } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-responsive-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ViewUsers.css";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateAmount, setUpdateAmount] = useState("");
  const [updateUsername, setUpdateUsername] = useState(null);

  useEffect(() => {
    fetchUsers();

    return () => {
      // Destroy DataTable on unmount
      if ($.fn.DataTable.isDataTable("#usersTable")) {
        $("#usersTable").DataTable().destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      initializeDataTable();
    }
  }, [users]);

  const fetchUsers = async () => {
    try {
      // Destroy DataTable before fetching new data
      if ($.fn.DataTable.isDataTable("#usersTable")) {
        $("#usersTable").DataTable().destroy();
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/get-users`);
      setUsers(response.data);
    } catch (err) {
      showToast("Error fetching users.", "danger");
    }
  };

  const initializeDataTable = () => {
    setTimeout(() => {
      $("#usersTable").DataTable({
        responsive: true,
        paging: true,
        autoWidth: false,
        scrollX: true,
        searching: true,
        ordering: true,
        destroy: true,
        drawCallback: function () {
          // Reapply custom styles after every table redraw
          $("#usersTable thead th").css({
            backgroundColor: "#007bff",
            color: "white",
            textAlign: "center",
            padding: "12px",
            fontSize: "16px",
          });

          $("#usersTable tbody td").css({
            textAlign: "center",
            verticalAlign: "middle",
            padding: "10px",
            fontSize: "14px",
          });
        },
      });
    }, 300);
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 5000); // 5 seconds
  };

  const handleSelectUser = (username) => {
    setSelectedUsers((prev) =>
      prev.includes(username) ? prev.filter((user) => user !== username) : [...prev, username]
    );
  };

  const handleUpdateCoins = (username = null) => {
    setUpdateUsername(username); // Set the username for single update
    setShowUpdateModal(true); // Show the custom update modal
  };

  const confirmUpdateCoins = async () => {
    const targetUsers = updateUsername ? [updateUsername] : selectedUsers;
    if (targetUsers.length === 0) {
      showToast("Select at least one user!", "warning");
      return;
    }

    if (!updateAmount || isNaN(updateAmount)) {
      showToast("Please enter a valid number.", "warning");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user/update-coins-bulk`, {
        usernames: targetUsers,
        coins: updateAmount,
        operation: "subtract", // Subtract the entered value from the current coins
      });
      showToast("Coins updated successfully!", "success");
      fetchUsers(); // Refresh the table after updating coins
      setSelectedUsers([]);
      setShowUpdateModal(false); // Hide the modal
      setUpdateAmount(""); // Reset the input field
    } catch {
      showToast("Failed to update coins.", "danger");
    }
  };

  const handleDeleteUsers = async (username = null) => {
    setConfirmDelete(username ? [username] : selectedUsers);
  };

  const confirmDeleteUsers = async () => {
    if (!confirmDelete || confirmDelete.length === 0) return;
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/delete-bulk`, { usernames: confirmDelete });

      if (response.data.success) {
        showToast("Users deleted successfully!", "success");
        fetchUsers(); // Refresh the table after deleting users
        setSelectedUsers([]);
      } else {
        showToast("Failed to delete users.", "danger");
      }
    } catch {
      showToast("Failed to delete users.", "danger");
    }
    setConfirmDelete(null);
  };

  return (
    <div className="view-users-container container">
      <h3 className="text-center mt-3">View Users</h3>

      <div className="bulk-actions mb-3">
        <button
          className="btn btn-primary me-2"
          onClick={() => handleUpdateCoins()}
          disabled={selectedUsers.length === 0}
        >
          Update Coins
        </button>
        <button
          className="btn btn-danger"
          onClick={() => handleDeleteUsers()}
          disabled={selectedUsers.length === 0}
        >
          Delete Selected
        </button>
      </div>

      <div className="table-container">
        <table id="usersTable" className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedUsers(e.target.checked ? users.map((user) => user.username) : [])
                  }
                  checked={selectedUsers.length === users.length && users.length > 0}
                />
              </th>
              <th>Ser. No.</th>
              <th>Username</th>
              <th>Coins</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.username}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.username)}
                    onChange={() => handleSelectUser(user.username)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.num_views || 0}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleUpdateCoins(user.username)}
                  >
                    Update Coins
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUsers(user.username)}
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="custom-toast">
          <div className={`alert alert-${toast.type}`}>
            {toast.message}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="delete-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete {confirmDelete.length} user(s)?</p>
            <button className="btn btn-danger" onClick={confirmDeleteUsers}>
              Confirm
            </button>
            <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Update Coins Modal */}
      {showUpdateModal && (
        <div className="update-modal">
          <div className="modal-content">
            <p>Enter the amount to subtract from {updateUsername || "selected users"}:</p>
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Enter amount"
              value={updateAmount}
              onChange={(e) => setUpdateAmount(e.target.value)}
            />
            <button className="btn btn-primary me-2" onClick={confirmUpdateCoins}>
              Update
            </button>
            <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUsers;