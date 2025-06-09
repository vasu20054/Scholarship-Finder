import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection after logout

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  // Effect to read user info from localStorage on component mount and when userInfo changes
  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString);
        setUsername(userInfo.username || ""); // Set username from the userInfo object
      } catch (e) {
        console.error("Error parsing userInfo from localStorage:", e);
        localStorage.removeItem("userInfo"); // Clear corrupted data
        setUsername("");
      }
    } else {
      setUsername(""); // No userInfo found
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // Remove the entire userInfo object
    setUsername(""); // Clear username state
    navigate("/login"); // Redirect to login page after logout
    setMenuOpen(false); // Close menu on logout
  };

  return (
    <nav className="navbar" role="navigation">
      <a className="navbar-brand" href="/">
        <span className="cap-emoji">🎓</span>
        Scholarship <span className="brand-blue">Finder</span>
      </a>
      <button
        className="navbar-toggler"
        aria-controls="navbarNav"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
      <div className={`navbar-collapse${menuOpen ? " active" : ""}`} id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/scholarship">Scholarship</a>
          </li>
          {/* Profile link should only be visible if logged in */}
          {username && (
            <li className="nav-item">
              <a className="nav-link" href="/profile">Profile</a>
            </li>
          )}
          {!username ? (
            <li className="nav-item" id="login-item">
              <a className="nav-link login-btn" href="/login">Log In</a>
            </li>
          ) : (
            <li className="nav-item" id="user-item" style={{ display: "flex", alignItems: "center" }}>
              <span className="username" style={{ marginRight: '10px' }}>Hello, {username}!</span>
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;