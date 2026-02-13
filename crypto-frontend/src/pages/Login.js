import React, { useState } from "react";
import { Link } from "react-router-dom";
import cryptoImage from "../assets/crypto.png";
import API from "../api";


function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post("/auth/login", {
      email,
      password
    });

    // Store JWT token
    localStorage.setItem("token", response.data);
    
    alert("Login Successful");

  } catch (error) {
    alert("Invalid Credentials");
  }
};


  return (
    <div className="auth-wrapper">

      <div className="left-section">
        <h1>Welcome Back</h1>
        <p>Access your Crypto Portfolio securely</p>

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

      <div className="right-section">
        <img src={cryptoImage} alt="Crypto Illustration" />
      </div>

    </div>
  );
}

export default Login;
