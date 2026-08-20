import React from "react";
import "./Login.css";
import home from "../Home/home.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Login() {
  //Bring backend deployed URL
  const url = "https://inote-benk.onrender.com";

  // To navigate to routes in react
  const navigate = useNavigate();

  //1. To set credentials
  const [emailLogin, setLMail] = useState("");
  const [emailCreate, setCMail] = useState("");
  const [passwordLogin, setLPass] = useState("");
  const [passwordCreate, setCPass] = useState("");
  const [name, setName] = useState("");

  //2. For Creating user
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/user/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: emailCreate,
          password: passwordCreate,
        }),
      });

      const data = await response.json();
      // checking the response & To take user to notes page
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/notes");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Server is starting. Please wait...");
    }
  };

  //2. For Logging in user
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailLogin,
          password: passwordLogin,
        }),
      });

      const data = await response.json();
      // checking the response & To take user to notes page
      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/notes");
      } else {
        setAlert("Email or password is incorrect");
      }
    } catch (error) {
      console.error(error);
      setAlert("Server is starting. Please wait...");
    }
    setLMail("");
    setLPass("");
  };

  const [alert, setAlert] = useState("");
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a
            className="navbar-brand"
            style={{
              color: "rgb(19, 95, 188)",
              fontSize: "25px",
              fontWeight: "600",
            }}
          >
            iN
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item d-flex">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {alert && (
        <div className="alert alert-danger" role="alert">
          {alert}
        </div>
      )}

      <div className="middle">
        {/* Create Account */}

        <div className="first">
          <div className="h">
            <h1>Welcome to</h1>
            <h1 className="inote-heading">iNote</h1>
          </div>

          <div className="createacc">
            <h3 className="font">Create Your Account</h3>

            <form onSubmit={handleCreate} className="acc">
              <input
                className="input"
                type="text"
                placeholder="Fullname (must be of more than 3 characters)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                className="input"
                type="email"
                placeholder="Email"
                value={emailCreate}
                onChange={(e) => setCMail(e.target.value)}
                required
              />

              <input
                className="input"
                type="password"
                placeholder="Password (must be of more than 3 characters)"
                value={passwordCreate}
                onChange={(e) => setCPass(e.target.value)}
                required
              />

              <input
                className="button"
                type="submit"
                value="Create your account"
              />
            </form>
          </div>
        </div>

        {/* OR */}

        <div className="or">or</div>

        {/* Login */}

        <div className="second">
          <div className="createacc">
            <h3 className="font">Login Your Account</h3>

            <form onSubmit={handleLogin} className="login-form">
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={emailLogin}
                onChange={(e) => setLMail(e.target.value)}
                required
              />

              <input
                className="input"
                type="password"
                placeholder="Password (must be of more than 3 characters)"
                value={passwordLogin}
                onChange={(e) => setLPass(e.target.value)}
                required
              />

              <input className="button" type="submit" value="Login" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
