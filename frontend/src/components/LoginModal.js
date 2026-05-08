import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const LoginModal = ({ onClose, setIsLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  return (
    <div className="modal-overlay">
      <div className="auth-modal">

        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Login to continue sharing securely.
        </p>

        <form
        className="auth-form"
        onSubmit={async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
            "http://localhost:5000/api/auth/login",
            {
                email,
                password,
            }
            );

            toast.success("Login successful");

            console.log(res.data);

            localStorage.setItem(
            "token",
            res.data.token
            );
            localStorage.setItem("loginTime", Date.now());
            setIsLoggedIn(true);

            onClose();

        } catch (err) {
            toast.error(
            err.response?.data?.message || "Login failed"
            );

        }
        }}
        >

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

          <button type="submit" className="auth-submit-btn">
            Login
          </button>

        </form>

      </div>
    </div>
  );
};

export default LoginModal;