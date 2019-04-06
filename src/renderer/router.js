// react-router config
import React from 'react';
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import App from "./App.js";

export default (
  <Router>
    <Route path="" exact component={App} ></Route>
  </Router>
);
