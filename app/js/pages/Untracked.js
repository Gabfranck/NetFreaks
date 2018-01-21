import React from "react";

import Item from "../components/Item";
import ItemStore from "../components/ItemStore";


export default class TvShows extends React.Component {
  render() {

    return (
      <div>
        <h1>Untracked Files</h1>
        <ItemStore model="untracked"/>
      </div>
    );
  }
}
