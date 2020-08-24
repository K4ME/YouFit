import React, { useState } from "react";
import { RadioGroup, RadioButton } from "react-radio-buttons";
import "./Register.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

//import api from "../services/api.js";

import logo from "../assets/YouFit.svg";
import api from "../services/api";

export default function Login({ history }) {
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [biograph, setBiograph] = useState("");
  const [adress, setAdress] = useState("");
  const [register, setRegister] = useState("Student");

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Senhas não conferem!");
    }
    if (password === confirmPassword) {
      const response = await api.post("/user/create/", {
        avatar: avatar,
        email: email,
        password: password,
        name: name,
        phone: phone,
        biograph: biograph,
        adress: adress,
        trainer: "",
      });
      history.push(`/login`);
    }
  }

  return (
    <div className="login-container">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Youfit Logo" />
        <input
          required
          placeholder="Digite seu nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          required
          placeholder="Informe o link da sua imagem"
          value={avatar}
          onChange={(event) => setAvatar(event.target.value)}
        />
        <input
          required
          placeholder="Digite seu WhatsApp"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <textarea
          placeholder="Conte um pouco sobre você!"
          value={biograph}
          onChange={(event) => setBiograph(event.target.value)}
        />
        <input
          required
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          required
          placeholder="Digite sua senha"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <input
          required
          placeholder="Confirme sua senha"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
