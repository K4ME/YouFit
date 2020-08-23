import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Login from "./pages/Login.js";
import LoginTrainer from "./pages/LoginTrainer.js";
import Main from "./pages/Main.js";
import MainTrainer from "./pages/MainTrainer.js";
import Register from "./pages/Register.js";
import RegisterTrainer from "./pages/RegisterTrainer.js";
import Landing from "./pages/Landing.js";

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/loginTrainer" component={LoginTrainer} />
      <Route path="/main/:id" component={Main} />
      <Route path="/mainTrainer/:id" component={MainTrainer} />
      <Route path="/register" component={Register} />
      <Route path="/registerTrainer" component={RegisterTrainer} />
    </BrowserRouter>
  );
}
