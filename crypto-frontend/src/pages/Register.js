import React, { useState } from "react";
import { Link } from "react-router-dom";
import cryptoImage from "../assets/crypto.png";
import API from "../api";


function Register() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await API.post("/auth/register", {
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    alert(response.data);

  } catch (error) {
    alert("Registration Failed");
  }
};


  return (
    <div className="auth-wrapper">

      <div className="left-section">
        <h1>Create Account</h1>
        <p>Start managing your Crypto Portfolio</p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <div className="right-section">
        <img src={cryptoImage} alt="Crypto Illustration" />
      </div>

    </div>
  );
}

export default Register;
