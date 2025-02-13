import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./UserProfile.css"; // Import custom CSS
import { FaCoins } from "react-icons/fa"; // Import coin icon

const UserProfile = () => {
  const { user, userLogout } = useAuth();
  const [videoId, setVideoId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [numViews, setNumViews] = useState(0);
  const [loading, setLoading] = useState(false);
  const [retryTimer, setRetryTimer] = useState(10);
  const navigate = useNavigate();
  const loopActive = useRef(true);
  const isFetching = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate("/userlogin");
      return;
    }
    fetchNumViews();
    loopActive.current = true;
    if (!isFetching.current) {
      isFetching.current = true;
      fetchVideoLoop();
    }
    return () => {
      loopActive.current = false;
    };
  }, [user]);

  const fetchNumViews = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/num-views/${user.username}`);
      if (response.data.success) {
        setNumViews(response.data.num_views);
      }
    } catch (error) {
      console.error("Error fetching num_views:", error);
    }
  };

  const fetchVideoLoop = async () => {
    while (loopActive.current) {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/fetch-order/${user.username}`);
        if (response.data.success && response.data.order) {
          const extractedVideoId = extractVideoId(response.data.order.video_link);
          if (extractedVideoId) {
            setVideoId(extractedVideoId);
            setTimer(45);
            await wait(45000);
            if (loopActive.current) {
              await incrementNumViews();
            }
          } else {
            setVideoId(null);
            setTimer(0);
            await startRetryTimer();
          }
        } else {
          setVideoId(null);
          setTimer(0);
          await startRetryTimer();
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        await startRetryTimer();
      } finally {
        setLoading(false);
      }
    }
  };

  const startRetryTimer = async () => {
    for (let i = 10; i >= 0; i--) {
      if (!loopActive.current) break;
      setRetryTimer(i);
      await wait(1000);
    }
  };

  const incrementNumViews = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/increment-views`, {
        username: user.username,
      });
      if (response.data.success) {
        setNumViews(response.data.num_views);
      }
    } catch (error) {
      console.error("Error incrementing num_views:", error);
    }
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/.*?[?&]v=|.*?\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
  };

  useEffect(() => {
    if (!videoId || timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [videoId, timer]);

  const handleLogout = async () => {
    loopActive.current = false;
    await userLogout();
    navigate("/userlogin", { replace: true });
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Progress Bar */}
      {loading && (
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
        <div className="container-fluid d-flex flex-row align-items-center justify-content-between">
          {/* Logo */}
          <h4 className="navbar-brand mb-0">YTPannel</h4>

          {/* Coins Display */}
          <div className="coin-display d-flex align-items-center">
            <FaCoins className="coin-icon text-warning me-2" />
            <h3 className="text-light mb-0">{numViews}</h3>
          </div>

          {/* Logout Button */}
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="d-flex flex-column align-items-center justify-content-center bg-light p-4 w-100 flex-grow-1">
        {/* Username with GIF Color Effect */}
        <div className="username-container mb-4">
          <h2 className="username-text">
            Welcome, <span className="gif-text">{user.username}</span>
          </h2>
        </div>

        {videoId ? (
          <>
            {/* Video Container */}
            <div className="video-container p-4">
              <iframe
                width="640"
                height="360"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video player"
                allow="autoplay"
                className="video-iframe"
              ></iframe>
            </div>

            {/* Timer */}
            <div className="mt-3 timer">
              <i className="bi bi-clock"></i> Time Remaining: {timer}s
            </div>
          </>
        ) : (
          <div className="no-video">
            <h3 className="text-danger">No video available in the system</h3>
            <p>Retrying in {retryTimer}s...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;