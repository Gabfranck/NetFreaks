import React from "react";
import { ipcRenderer } from 'electron';

import { Link } from "react-router";

export default class Search extends React.Component {
  constructor() {
    super()
  }

  reload_data(){
      console.log('temp');
      ipcRenderer.sendSync('reload-data')
  }

  render() {

    return (

      <div className="navbar navbar-inverse navbar-fixed-top header" role="navigation">
        <div className="container nav-no-padding">
          <div>
            <div className="col-md-4 col-sm-4" >

                  <img className="pull-left logo-image" src="./data/logo_icon.png"/>
                  <h2 className="pull-left logo">
                      NETFREAKS
                  </h2>
            </div>


            <div className="col-md-2 col-sm-2 pull-right" >
              <a  className="pull-right"  style={{marginTop:"5px", textAlign: "center", fontSize: "45px", color: "#eee"}}  href="javascript:void(0)" onClick={this.reload_data.bind(this)}>
                <i className="fa fa-refresh"></i>
              </a>
            </div>


          </div>
        </div>
      </div>


    );
  }
}

// <div className="col-sm-8 col-md-8 ">
//   <form className="navbar-form text-center" role="search">
//     <div className="input-group col-md-8" style={{marginTop: "10px"}}>
//       <input className="input-group-item form-control "  placeholder="Search" name="q" type="text"/>
//       <div className="input-group-btn" style={{textAlign: "left"}}>
//         <button className="btn  btn-custom " type="submit"><i className="fa fa-search"></i></button>
//       </div>
//     </div>
//   </form>
// </div>
