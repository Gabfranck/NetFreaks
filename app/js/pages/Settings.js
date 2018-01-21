import React from "react";
import { ipcRenderer } from 'electron';
const config = require('../../../config');

export default class Settings extends React.Component {
  change_folder(){
    ipcRenderer.sendSync('change-folder')
  }
  render() {
    console.log("settings");
    return (
        <div>
        <h1>Settings</h1>
        <div className="row" style={{margin: "20px",fontSize: "25px"}}>
        <i><b>Media Folder :</b> {config.MainFolder}</i>
        <button className="btn btn-custom pull-right"  style={{marginLeft:"25px",marginTop: "-5px", fontSize: "20px",textAlign: "center", color: "#eee"}}  href="javascript:void(0)" onClick={this.change_folder.bind(this)}>
          Change Media Folder <i className="fa fa-folder"></i>
        </button>
        </div>
        </div>

    );
  }
}
