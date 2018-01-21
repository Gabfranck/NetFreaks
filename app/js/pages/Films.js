import React from "react";
import Item from "../components/Item";
import ItemStore from "../components/ItemStore";

export default class Films extends React.Component {
  render() {
    // const Films = ItemStore.get_films().map((title, i) => <Item key={i} title={title}/> );

    return (
      <div>
        <h1>Films</h1>
        <ItemStore model="films"/>
      </div>

    );
  }
}
