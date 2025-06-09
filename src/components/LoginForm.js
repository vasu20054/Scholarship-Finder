import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setShowError(true);
      return;
    }

    setLoading(true);
    setShowError(false);

    try {
      // Make POST request to backend for login
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setShowError(true);
        setLoading(false);
        return;
      }

      // Store full user info (including token) for navbar and auth
      localStorage.setItem("userInfo", JSON.stringify(data));
      setShowError(false);
      setLoading(false);
      navigate("/"); // Redirect to home after login
    } catch (err) {
      setShowError(true);
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-form">
        <div className="login-glass">
          <h2>Welcome Back!</h2>
          <form id="login-form" role="form" autoComplete="off" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                aria-label="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                aria-label="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-btn-main" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <a href="#forgot-password" className="forgot-password">Forgot Password?</a>
            <div className="divider"><span>OR</span></div>
            <a href="#google-login" className="google-login">
              <img src="https://www.google.com/favicon.ico" alt="Google logo" />
              Log in with Google
            </a>
            <a href="/signup" className="signup-link">Don't have an account? <span>Sign Up</span></a>
            <div
              id="login-error"
              className="login-error"
              style={{ display: showError ? "block" : "none" }}
            >
              Invalid username or password.
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;