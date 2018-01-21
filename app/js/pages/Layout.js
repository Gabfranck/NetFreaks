import React from "react";
import { Link } from "react-router";

import Footer from "../components/layout/Footer";
import Nav from "../components/layout/Nav";
import Search from "../components/layout/Search";


export default class Layout extends React.Component {
  render() {
    const { location } = this.props;

    return (
      <div style={{height: "100%", width:"100%"}} >

        <Search location={location} />
        <Nav location={location} />

        <div className="content container" >
          <div className="row">
            <div className="col-lg-12" >

              {this.props.children}

            </div>
          </div>
          <Footer/>
        </div>
      </div>

    );
  }
}
