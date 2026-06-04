import { io } from "socket.io-client";

const socket = io("https://ythub.lat", {
  withCredentials: true
});

export default socket;