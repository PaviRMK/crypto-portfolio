import React, { useState } from "react";
import { Link } from "react-router-dom";
import cryptoImage from "../assets/crypto.png";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/pages/login.css";



function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post("/auth/login", {
      email,
      password
    });

    // Store JWT token
    if (response.status === 200) {
        localStorage.setItem("token", response.data);

        setMessage("Login Successful");
        setMessageType("success");
        
        setTimeout(() => {
            navigate("/dashboard");
        }, 1000);
    }

  } catch (error) {
    setMessage("Invalid Credentials");
    setMessageType("error");
  }
};


  return (
    <div className="auth-page">
    <div className="auth-wrapper">

      <div className="auth-left">
        <h1>Welcome Back</h1>
        <p>Access your Crypto Portfolio securely</p>
        {message && (
        <p className={messageType === "success" ? "success-msg" : "error-msg"}>
          {message}
        </p>
      )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Sign In</button>
        </form>

        <p className="switch">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>

      <div className="auth-right">
        <img src={cryptoImage} alt="Crypto Illustration" />
      </div>

    </div>
    </div>
  );
}

export default Login;
