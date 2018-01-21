import React from "react";
import Fs from 'fs';
const config = require('../../../config');

import ItemStore from "../components/ItemStore";

var Untracked = JSON.parse(Fs.readFileSync(config.MainFolder+'/untracked.json', 'utf8'))


export default class Home extends React.Component {
  render() {
    let untrackLength = Untracked.length

    return (
      <div>
        <h1>Films</h1>
        <ItemStore location="/" model="films"/>
        <h1>TV Shows</h1>
        <ItemStore location="/" model="tv_shows"/>
        {untrackLength > 0 &&
          <div>
            <h1>Untracked Files</h1>
            <ItemStore location="/" model="untracked"/>
          </div>
        }
      </div>
    );
  }
}
