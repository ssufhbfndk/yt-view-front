import { io } from "socket.io-client";

const socket = io("https://api.ythub.lat", {
  withCredentials: true
});

export default socket;