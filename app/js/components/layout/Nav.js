import React from "react";
import { Link } from "react-router";
import Fs from 'fs';
const config = require('../../../../config');


var Untracked = JSON.parse(Fs.readFileSync(config.MainFolder+'/untracked.json', 'utf8'))


export default class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse() {

  }

  render() {
    let untrackedLength = Untracked.length

    const { location } = this.props;
    const { collapsed } = this.state;
    const homeClass = location.pathname === "/" ? "active" : "";
    const tvShowsClass = location.pathname.match(/^\/tv_shows/) ? "active" : "";
    const filmsClass = location.pathname.match(/^\/films/) ? "active" : "";
    const settingsClass = location.pathname.match(/^\/settings/) ? "active" : "";
    const UntrackedClass = location.pathname.match(/^\/untracked/) ? "active" : "";

    return (
      <div className="icon-bar">
        <Link className={homeClass} to="/" onClick={this.toggleCollapse.bind(this)}>
          <i className="fa fa-home"></i>
        </Link>
        <Link className={filmsClass} to="films" onClick={this.toggleCollapse.bind(this)}>
          <i className="fa fa-video-camera"></i>
        </Link>
        <Link className={tvShowsClass} to="tv_shows" onClick={this.toggleCollapse.bind(this)}>
          <i className="fa fa-tv"></i>
        </Link>
        {untrackedLength > 0 &&
          <Link className={UntrackedClass} to="untracked" onClick={this.toggleCollapse.bind(this)}>
          <i className="fa fa-file-movie-o"></i>
          </Link>
        }
        <Link className={settingsClass + " fixed-bottom"} to="settings" onClick={this.toggleCollapse.bind(this)}>
          <i className="fa fa-gear"></i>
        </Link>
      </div>

    );
  }
}
//
// <nav className="navbar navbar-inverse navbar-fixed-top header" role="navigation">
//   <div className="container nav-no-padding">
//
//     <div className="navbar-header">
//       <button type="button" className="navbar-toggle" onClick={this.toggleCollapse.bind(this)} >
//         <span className="sr-only">Toggle navigation</span>
//         <span className="icon-bar"></span>
//         <span className="icon-bar"></span>
//         <span className="icon-bar"></span>
//       </button>
//     </div>
//     <div className={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
//       <ul className="nav navbar-nav">
//         <li className={homeClass}>
          // <Link to="/" onClick={this.toggleCollapse.bind(this)}>
          //   <i className="fa fa-home"></i>
          //   NerFreaks
          // </Link>
//         </li>
//         <li className={filmsClass}>
//           <Link to="films" onClick={this.toggleCollapse.bind(this)}>
//             <i className="fa fa-video-camera"></i>
//             Films
//           </Link>
//         </li>
//         <li >
//           <Link to="tv_shows" onClick={this.toggleCollapse.bind(this)}>
//             <i className="fa fa-tv"></i>
//             TV Shows
//           </Link>
//         </li>
//         <li >
          // <Link to="untracked" onClick={this.toggleCollapse.bind(this)}>
          //   <i className="fa fa-file-movie-o"></i>
          //   Untracked Files
          // </Link>
//         </li>
//       </ul>
//       <ul className="nav navbar-nav pull-right">
//         <li >
          // <Link to="settings" onClick={this.toggleCollapse.bind(this)}>
          //   <i className="fa fa-gear"></i>
          //   Settings
          // </Link>
//           </li>
//       </ul>
//     </div>
//   </div>
// </nav>
