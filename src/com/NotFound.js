import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {

return (

<div className="notfound-container">

<div className="notfound-card">

<div className="notfound-code">

404

</div>

<h2>

Page Not Found

</h2>

<p>

The page you are looking for does not exist.

</p>

<Link
to="/dashboard"
className="notfound-btn"
>

Go Dashboard

</Link>

</div>

</div>

);

};

export default NotFound;