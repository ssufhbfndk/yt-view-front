import React, { useState } from "react";
import axios from "axios";

import {
  FaBell,
  FaHeading,
  FaAlignLeft,
  FaLink
} from "react-icons/fa";

import "./NotificationBroadcast.css";

const NotificationBroadcast = () => {

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // ======================
  // TOAST
  // ======================

  const showToast = (
    message,
    type = "success"
  ) => {

    setToast({
      show: true,
      message,
      type
    });

    setTimeout(() => {

      setToast({
        show: false,
        message: "",
        type: "success"
      });

    }, 3000);

  };

  // ======================
  // VALIDATE
  // ======================

  const validateForm = () => {

    if (!title.trim()) {

      showToast(
        "Title is required",
        "error"
      );

      return false;

    }

    if (!body.trim()) {

      showToast(
        "Body is required",
        "error"
      );

      return false;

    }

    return true;

  };

  // ======================
  // SEND
  // ======================

  const sendNotification = async () => {

    if (!validateForm()) {
      return;
    }

    try {

      setLoading(true);

      let finalLink = "";

      if (link.trim()) {

        finalLink =
          link.startsWith("http://") ||
          link.startsWith("https://")
            ? link.trim()
            : `https://${link.trim()}`;

      }

      const response =
        await axios.post(

          `${process.env.REACT_APP_API_URL}/admin/broadcast-notification`,

          {
            title: title.trim(),
            body: body.trim(),
            link: finalLink
          },{
    withCredentials: true, // 🔐 IMPORTANT
  }

        );

      showToast(

        response?.data?.message ||
        "Notification Sent",

        "success"

      );

      // RESET

      setTitle("");
      setBody("");
      setLink("");

    } catch (error) {

      showToast(

        error?.response?.data?.message ||
        "Failed To Send Notification",

        "error"

      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="notification-container">

      {

        toast.show && (

          <div
            className={`
            notification-toast
            ${
              toast.type === "success"
                ? "notification-success"
                : "notification-error"
            }
          `}
          >

            {toast.message}

          </div>

        )

      }

      <div className="notification-card">

        {/* HEADER */}

        <div className="notification-header">

          <div className="notification-icon">

            <FaBell />

          </div>

          <h2>

            Broadcast Notification

          </h2>

          <p>

            Send notification to users

          </p>

        </div>

        {/* FORM */}

        <div className="notification-form">

          {/* TITLE */}

          <div className="notification-field">

            <div
              className="notification-icon-box"
            >

              <FaHeading />

            </div>

            <input

              type="text"

              placeholder="
              Enter Notification Title
              "

              value={title}

              onChange={(e) =>

                setTitle(
                  e.target.value
                )

              }

            />

          </div>

          {/* BODY */}

          <div className="notification-field">

            <div
              className="notification-icon-box"
            >

              <FaAlignLeft />

            </div>

            <input

              type="text"

              placeholder="
              Enter Notification Body
              "

              value={body}

              onChange={(e) =>

                setBody(
                  e.target.value
                )

              }

            />

          </div>

          {/* LINK */}

          <div className="notification-field">

            <div
              className="notification-icon-box"
            >

              <FaLink />

            </div>

            <input

              type="text"

              placeholder="
              Optional Link
              "

              value={link}

              onChange={(e) =>

                setLink(
                  e.target.value
                )

              }

            />

          </div>

          {/* BUTTON */}

          <button

            className="
            notification-btn
            "

            disabled={loading}

            onClick={
              sendNotification
            }

          >

            {

              loading

                ?

                "Sending..."

                :

                "Send Notification"

            }

          </button>

        </div>

      </div>

    </div>

  );

};

export default NotificationBroadcast;