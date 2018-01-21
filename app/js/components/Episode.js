import React from "react";
import Item from "./Item";
import electron, { ipcRenderer } from 'electron';
import Fs from 'fs';
const config = require('../../../config');

var TvShows = JSON.parse(Fs.readFileSync(config.MainFolder+'/tv_shows.json', 'utf8'))


export default class Episode extends React.Component {
  constructor(props) {
      super(props);
  }

  exec_vlc_ep(){
    if (this.props.filename) {
      let filename = this.props.filename
      ipcRenderer.sendSync('vlc-exec', filename)
    }
  }

  render() {


    return (
      <button className="list-group-item list-group-item-action text-center"  href="javascript:void(0)" onClick={this.exec_vlc_ep.bind(this)}>
        <b className="pull-left"> Saison {this.props.season}</b>
        <b className="pull-right">Episode {this.props.episode}</b>
      </button>
    )

  }
}
