// frontend/src/pages/LoginPage.js

import React from "react";
// import Navbar from "../components/Navbar"; // REMOVED: Navbar is now handled globally in App.js
import LoginForm from "../components/LoginForm"; // Imports LoginForm component
import "../App.css"; // Global styles

const LoginPage = () => (
  <>
    {/* <Navbar /> */} {/* REMOVED: Navbar is now handled globally */}
    <LoginForm /> {/* Renders the LoginForm component */}
  </>
);

export default LoginPage;