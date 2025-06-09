import React from 'react';
import SignupForm from '../components/SignupForm'; // Import SignupForm
import '../App.css';

const SignupPage = () => (
  <section className="signup-section">
    <div className="signup-form-container">
      <div className="signup-glass">
        <h2>Create Your Account</h2>
        <SignupForm />
      </div>
    </div>
  </section>
);

export default SignupPage;