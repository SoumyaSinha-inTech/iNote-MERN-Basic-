import React from "react";
import "./Home.css";
import home from "../Home/home.png";
import { Link } from "react-router-dom";

function Home() {
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
                <Link className="nav-link" to="/login">
                  Log In / Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="textpart">
          <div className="text">
            <p style={{ color: "rgb(19, 95, 188)" }}>iNote </p>
            <p> Your Smart Digital Notebook,</p>
            <p>Synced Everywhere</p>
            <br />
            <h6>
              From everyday thoughts to important ideas.
              <br /> Capture, Organize and Access seamlessly.
            </h6>
          </div>
          <div className="buttons">
            <Link to="/login">
              {" "}
              <button className="strt">Get Started For Free</button>
            </Link>
            <Link to="/login">
              {" "}
              <button className="create" to="/login">
                Create Account
              </button>
            </Link>
          </div>
        </div>
        <div className="image">
          <img src={home} alt="iNote" />
        </div>
      </div>
    </>
  );
}

export default Home;
