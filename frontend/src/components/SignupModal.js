import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SignupModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (

    <div className="modal-overlay">
      <div className="auth-modal">
        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Start sharing files securely.
        </p>

        <form
        className="auth-form"
        onSubmit={async (e) => {

          e.preventDefault();

          try {

            const res = await axios.post(
              "http://localhost:5000/api/auth/signup",
              {
                name,
                email,
                password,
              }
            );

            toast.success("SignUp successful");

            localStorage.setItem("token", res.data.token);

            localStorage.setItem("loginTime", Date.now());

            window.location.reload();

            onClose();

          } catch (err) {

            toast.error(
              err.response?.data?.message || "SignUp failed"
            );

          }

        }}
        
        >

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="auth-submit-btn"
          >
            Get Started
          </button>

        </form>

      </div>

    </div>

  );
};

export default SignupModal;