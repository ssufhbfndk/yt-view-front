import React, { useState } from "react";
import axios from "axios";
import "./AddUser.css"; // ✅ Separate CSS file

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const addUser = async () => {
    setMessage({ type: "", text: "" });

    if (!username.trim()) {
      setMessage({ type: "error", text: "Username is required." });
      return;
    }

    try {
      // Check if user exists in the database
      const checkUser = await axios.post("http://localhost:5000/api/user/check-user", { username });

      if (checkUser.data.exists) {
        setMessage({ type: "error", text: "Username already exists." });
        return;
      }

      // Add user
      const response = await axios.post("http://localhost:5000/api/user/add-user", { username });

      if (response.data.success) {
        setMessage({ type: "success", text: "User added successfully." });
        setUsername("");
      } else {
        setMessage({ type: "error", text: "Failed to add user." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error connecting to server." });
    }
  };

  return (
    <div className="add-user-container">
      <div className="add-user-card">
        <h3>Add User</h3>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={addUser}>Add User</button>
        {message.text && (
          <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUser;
