import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Login from "./pages/Login.js";
import LoginTrainer from "./pages/LoginTrainer.js";
import Main from "./pages/Main.js";
import Register from "./pages/Register.js";
import Landing from "./pages/Landing.js";
import mainTrainer from "./pages/MainTrainer.js";

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/main/:id" component={Main} />
      <Route path="/mainTrainer/:id" component={mainTrainer} />
      <Route path="/register" component={Register} />
      <Route path="/landing" component={Landing} />
      <Route path="/loginTrainer" component={LoginTrainer} />
    </BrowserRouter>
  );
}
