// NetFreaks - Media Center under GPLv3
// Copyright (C) 2018  Gabriel Franck
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import TvShows from "./pages/TvShows";
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Settings from "./pages/Settings";
import Films from "./pages/Films";
import Untracked from "./pages/Untracked";
import Item from "./components/Item";

const app = document.getElementById('app');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Home}></IndexRoute>
      <Route path="films" name="films" component={Films}></Route>
      <Route path="*/:id_item" name="films" component={Item}></Route>
      <Route path="tv_shows" name="tv_shows" component={TvShows}></Route>
      <Route path="settings" name="settings" component={Settings}></Route>
      <Route path="untracked" name="untracked" component={Untracked}></Route>
    </Route>
  </Router>,
app);
