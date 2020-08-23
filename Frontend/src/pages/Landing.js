import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import logoImg from "../assets/YouFit.svg";
import landingImg from "../assets/landing2.jpg";
import purpleHeart from "../assets/purple-heart.svg";

import "./Landing.css";
import api from "../services/api";

function Landing() {
  return (
    <div id="page-landing">
      <div id="page-landing-content" className="container">
        <div id="logo-container">
          <img src={logoImg} alt="YouFit" />
          <h2>
            Plataforma desenvolvida para unir treinadores e alunos de academia
            de musculação.
          </h2>
        </div>

        <img
          src={landingImg}
          alt="Plataforma de estudos"
          className="hero-image"
        />

        <div className="buttons-container">
          <Link to="/" className="study">
            Treinar
          </Link>

          <Link to="/loginTrainer" className="give-classes">
            Dar treinos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
