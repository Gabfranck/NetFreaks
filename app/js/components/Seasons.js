import React from "react";
import Episode from "./Episode";
import electron, { ipcRenderer } from 'electron';
import Fs from 'fs';
const config = require('../../../config');


var TvShows = JSON.parse(Fs.readFileSync(config.MainFolder+'/tv_shows.json', 'utf8'))
var Untracked = JSON.parse(Fs.readFileSync(config.MainFolder+'/untracked.json', 'utf8'))

export default class Seasons extends React.Component {
  constructor(props) {
      super(props);
      const { title } = this.props;
      let item
      console.log(this.props.season);

      if (this.props.type == "untracked") {
        item = Untracked.filter(show => show.Title == title);
      }else {
        item = TvShows.filter(show => show.Title == title);
      }


      if( item[0] != undefined){
        item = item[0]
        this.state = {item: item, season: this.props.season}
      }
  }


  render() {
    let seasons
    let episodes
    let data

    episodes = this.state.item.episodes.filter(item => item.season == this.props.season)
    data = episodes.map((item, i) => {
      return <Episode key={i} filename={item.filename} season={item.season} episode={item.episode}/>
    })


    return (
      <div className="list-group">
        {data}
      </div>
    )

  }
}
