import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Login from "./pages/Login.js";
import Main from "./pages/Main.js";
import Register from "./pages/Register.js";
import Landing from "./pages/Landing.js";

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/main/:id" component={Main} />
      <Route path="/register" component={Register} />
      <Route path="/landing" component={Landing} />
    </BrowserRouter>
  );
}
