import React, { useState } from "react";
import "./Login.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox } from "antd";

import api from "../services/api.js";

import logo from "../assets/YouFit.svg";

export default function Login({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await api.post("/trainer/login", {
      email: email,
      password: password,
    });

    if (response.data !== "erro") history.push(`/mainTrainer/${response.data}`);
    if (response.data === "erro") toast.error("Usuário ou senha não conferem!");
  }

  async function handleButton(event) {
    event.preventDefault();
    history.push(`/registerTrainer`);
  }

  return (
    <div className="login-container">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Youfit Logo" />
        <input
          required
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          required
          placeholder="Digite sua senha"
          type="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Enviar</button>
        <button
          id="Cadastrar"
          type="button"
          onClick={(event) => handleButton(event)}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
