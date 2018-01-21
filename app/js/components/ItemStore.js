import React from "react";
import electron, { ipcRenderer } from 'electron';
import Fs from 'fs';
const config = require('../../../config');


import Item from "./Item";


var TvShows = JSON.parse(Fs.readFileSync(config.MainFolder+'/tv_shows.json', 'utf8'))
var Films = JSON.parse(Fs.readFileSync(config.MainFolder+'/films.json', 'utf8'))
var Untracked = JSON.parse(Fs.readFileSync(config.MainFolder+'/untracked.json', 'utf8'))

export default class ItemStore extends React.Component {
  constructor(props){
    super(props)
    let location = this.props.location
    console.log(location);
    this.state = {index: 0, choosed: false, quit: false}
    if (location != "/" ) {

      ipcRenderer.on('right', (event, message) => {
        let new_index
        if(this.props.model == 'films') new_index = (this.state.index + 1) % Films.length
        if(this.props.model == 'tv_shows') new_index = (this.state.index + 1) % TvShows.length
        if(this.props.model == 'untracked') new_index = (this.state.index + 1) % Untracked.length
        this.setState({index: new_index })
        console.log(this.state.index);
      });
      ipcRenderer.on('left', (event, message) => {
        let new_index
        if(this.props.model == 'films') new_index = (this.state.index - 1) % Films.length
        if(this.props.model == 'tv_shows') new_index = (this.state.index - 1) % TvShows.length
        if(this.props.model == 'untracked') new_index = (this.state.index - 1) % Untracked.length
        if (new_index < 0) {
          if(this.props.model == 'films') new_index = Films.length - 1
          if(this.props.model == 'tv_shows') new_index = TvShows.length - 1
          if(this.props.model == 'untracked') new_index = Untracked.length - 1
        }
        this.setState({index: new_index })
        console.log(this.state.index);
      });
      ipcRenderer.on('up', (event, message) => {
        let new_index
        if(this.props.model == 'films') new_index = (this.state.index - 5) % Films.length
        if(this.props.model == 'tv_shows') new_index = (this.state.index - 5) % TvShows.length
        if(this.props.model == 'untracked') new_index = (this.state.index - 5) % Untracked.length
        if (new_index < 0) {
          if(this.props.model == 'films') new_index = Films.length - 1
          if(this.props.model == 'tv_shows') new_index = TvShows.length - 1
          if(this.props.model == 'untracked') new_index = Untracked.length - 1
        }
        this.setState({index: new_index })
        console.log(this.state.index);
      });
      ipcRenderer.on('down', (event, message) => {
        let new_index
        if(this.props.model == 'films') new_index = (this.state.index + 5) % Films.length
        if(this.props.model == 'tv_shows') new_index = (this.state.index + 5) % TvShows.length
        if(this.props.model == 'untracked') new_index = (this.state.index + 5) % Untracked.length
        this.setState({index: new_index })
        console.log(this.state.index);
      });

      ipcRenderer.on('enter', (event, message) => {
        this.setState({choosed: true })
        console.log(this.state.choosed);
      });

      ipcRenderer.on('esc', (event, message) => {
        this.setState({quit: true })
        console.log(this.state.choosed);
      });
    }
  }

  render() {

    let data
    let type
    let bool = false
    let bool2 = false
    let bool3 = false

    switch (this.props.model) {
      case "films":
      data = Films.map((item, i) => {
        if( i == this.state.index && this.props.location != "/"){
          bool=true
          if(this.state.choosed){
            bool2 = true
            this.setState({choosed: false})
          }else if (this.state.quit) {
            bool3 = true
            this.setState({quit: false})
          }else {
            bool2 = false
            bool3 = false
          }
        } else {
          bool2 = false
          bool = false
        }
        return <Item key={i} type="films"  onClick={() => {bool = true}} quit={bool3} choosed={bool2} selected={bool} filename={item.Filename} title={item.Title}/>
      })
      break;

      case "tv_shows":
      data = TvShows.map((item, i) => {
        console.log(i)
        if( i == this.state.index && this.props.location != "/"){
          bool=true
          if(this.state.choosed){
            bool2 = true
            this.setState({choosed: false})
          }else if (this.state.quit) {
            bool3 = true
            this.setState({quit: false})
          }else {
            bool2 = false
            bool3 = false
          }
        } else {
          bool2 = false
          bool = false
        }
        return <Item key={i} type="tv_shows"  onClick={() => {bool = true}} quit={bool3} choosed={bool2} selected={bool} title={item.Title}/>
      })
      break;

      case "untracked":
      data = Untracked.map((item, i) => {
        if( i == this.state.index && this.props.location != "/"){
          bool=true
          if(this.state.choosed){
            bool2 = true
            this.setState({choosed: false})
          }else if (this.state.quit) {
            bool3 = true
            this.setState({quit: false})
          }else {
            bool2 = false
            bool3 = false
          }
        } else {
          bool2 = false
          bool = false
        }
        if (item.Filename != undefined) {
          return <Item key={i} type="untracked" onClick={() => {bool = true}} quit={bool3} choosed={bool2} filename={item.Filename} selected={bool} title={item.Title}/>
        }
        else {
          return <Item key={i} type="untracked"  onClick={() => {bool = true}} quit={bool3} choosed={bool2} selected={bool} title={item.Title}/>
        }
      })
      break;

      default:
    }

    return (
      <div className="col-md-12 text-center">{data}
      </div>
    )
  }
}
