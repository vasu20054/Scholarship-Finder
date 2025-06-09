import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignupForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
    university: "",
    cgpi: "",
    degree: "",
    specialization: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirm ||
      !form.university ||
      !form.cgpi ||
      !form.degree ||
      !form.specialization
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    const signupData = {
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      email: form.email,
      password: form.password,
      university: form.university,
      cgpi: form.cgpi,
      degree: form.degree,
      specialization: form.specialization,
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      setError("");
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <form id="signup-form" role="form" autoComplete="off" onSubmit={handleSignup}>
      <div className="input-group">
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" name="firstName" type="text" placeholder="First Name" required value={form.firstName} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" name="lastName" type="text" placeholder="Last Name" required value={form.lastName} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" placeholder="Choose a username" required value={form.username} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Enter your email" required value={form.email} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label htmlFor="university">University</label>
        <input id="university" name="university" type="text" placeholder="Your University" required value={form.university} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label htmlFor="cgpi">CGPI</label>
        <input id="cgpi" name="cgpi" type="text" placeholder="Your CGPI" required value={form.cgpi} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label htmlFor="degree">Degree</label>
        <input id="degree" name="degree" type="text" placeholder="Your Degree (e.g. B.Tech, B.Sc)" required value={form.degree} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label htmlFor="specialization">Specialization</label>
        <input id="specialization" name="specialization" type="text" placeholder="Specialization (e.g. Computer Science)" required value={form.specialization} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label htmlFor="signup-password">Password</label>
        <input id="signup-password" name="password" type="password" placeholder="Create a password" required value={form.password} onChange={handleChange} />
      </div>
      <div className="input-group">
        <label htmlFor="signup-confirm">Confirm Password</label>
        <input id="signup-confirm" name="confirm" type="password" placeholder="Re-enter your password" required value={form.confirm} onChange={handleChange} />
      </div>
      <button type="submit" className="login-btn-main" disabled={loading}>
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
      <Link to="/login" className="signup-link">
        Already have an account? <span>Log In</span>
      </Link>
      {error && (
        <div id="signup-error" className="login-error" style={{ display: "block" }}>
          {error}
        </div>
      )}
    </form>
  );
};

export default SignupForm;