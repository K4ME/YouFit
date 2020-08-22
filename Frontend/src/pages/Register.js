import React, { useState } from "react";
import { RadioGroup, RadioButton } from "react-radio-buttons";
import "./Register.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "antd/dist/antd.css";
import { Radio } from "antd";
//import api from "../services/api.js";

import logo from "../assets/YouFit.svg";
import api from "../services/api";

export default function Login({ history }) {
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
    if (register === "Student" && password === confirmPassword) {
      const response = await api.post("/user/create/", {
        email: email,
        password: password,
        name: name,
        phone: phone,
        biograph: biograph,
        adress: adress,
        trainer: "",
      });
      history.push(`/main`);
    }

    if (register === "Trainer" && password === confirmPassword) {
      const response = await api.post("/trainer/create/", {
        email: email,
        password: password,
        name: name,
        phone: phone,
        biograph: biograph,
        adress: adress,
      });
      history.push(`/main`);
    }
  }

  return (
    <div className="login-container">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="Tindev Logo" />
        <input
          required
          placeholder="Digite seu nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          required
          placeholder="Digite seu telefone"
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
        <div className="container-radio-button">
          <Radio.Group value={register}>
            <Radio
              value="Student"
              checked={register === "Student"}
              onClick={() => setRegister("Student")}
            >
              Aluno
            </Radio>
            <Radio
              value="Trainer"
              checked={register === "Trainer"}
              onClick={() => setRegister("Trainer")}
            >
              Trainador
            </Radio>
          </Radio.Group>
        </div>
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
