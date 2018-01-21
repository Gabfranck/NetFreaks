import React from "react";
import electron, { ipcRenderer } from 'electron';
import Fs from 'fs';
const config = require('../../../config');


var TvShows = JSON.parse(Fs.readFileSync(config.MainFolder+'/tv_shows.json', 'utf8'))
var Films = JSON.parse(Fs.readFileSync(config.MainFolder+'/films.json', 'utf8'))
var Untracked = JSON.parse(Fs.readFileSync(config.MainFolder+'/untracked.json', 'utf8'))

import Episode from "./Episode";
import Seasons from "./Seasons";



export default class Item extends React.Component {
  constructor(props) {
    super(props);
    const { title } = this.props;
    let item

    switch (this.props.type) {
      case "films":
      item = Films.filter(film => film.Title == title);
      break;

      case "tv_shows":
      item = TvShows.filter(show => show.Title == title);
      break;

      case "untracked":
      item = Untracked.filter(show => show.Title == title);
      break;
      default:
    }
    if( item[0] != undefined){
      item = item[0]
      if(this.props.type == "tv_shows" ){
        console.log(item.Title);

        console.log(item.episodes);
        item.episodes.map((k, i) => {
          this.state = {item: item, season: k.season}

        })
      }else if (this.props.type == "untracked" ) {
        if(item.episodes != undefined){
          item.episodes.map((k, i) => {
            this.state = {item: item, season: k.season}
          })
        }else {
          this.state = {item: item, season: "01"}
        }
      }
      else {
        this.state = {item: item, season: "01"}
      }
    }
  }

  exec_vlc(){
    if (this.props.filename) {
      let filename = this.props.filename
      ipcRenderer.sendSync('vlc-exec', filename)
    }
  }

  closeNav(){
    document.getElementById("myNav"+this.state.item.Title).style.transition = "0.35s";
    document.getElementById("myNav"+this.state.item.Title).style.overflow = "hidden";
    document.getElementById("myNav"+this.state.item.Title).style.width = "0%";
  }
  openNav(){
    document.getElementById("myNav"+this.state.item.Title).style.transition = "0.7s";
    document.getElementById("myNav"+this.state.item.Title).style.overflow = "auto";
    document.getElementById("myNav"+this.state.item.Title).style.width = "calc( 100% - 100px)";
    document.getElementById("myNav"+this.state.item.Title).style.right = "0px";
  }

  setSeason(season){
    this.setState({season: season})
    console.log(this.state.season);
  }

  render() {


    let SelectedClass
    let SelectedClassSeason
    let data
    let SeasonsList
    let seasons = []

    if(this.props.type == "tv_shows"){
      console.log(this);
      SeasonsList = this.state.item.episodes.map((item, i) => {
        if (!seasons.includes(item.season)) {
          seasons.push(item.season);
          if (this.state.season == item.season) {
            SelectedClassSeason = "btn-season-active"
          }else{
            SelectedClassSeason = ""
          }

          return <button onClick={this.setSeason.bind(this, item.season)} className={ SelectedClassSeason + " btn btn-season"}>{item.season}</button>
        }
      })
    }

    if(this.props.type == "untracked"){
      if (this.state.item.episodes != undefined) {

        console.log(this);
        SeasonsList = this.state.item.episodes.map((item, i) => {
          if (!seasons.includes(item.season)) {
            seasons.push(item.season);
            if (this.state.season == item.season) {
              SelectedClassSeason = "btn-season-active"
            }else{
              SelectedClassSeason = ""
            }

            return <button onClick={this.setSeason.bind(this, item.season)} className={ SelectedClassSeason + " btn btn-season"}>{item.season}</button>
          }
        })
      }
    }

    if(this.props.selected){
      SelectedClass = "poster-selected"
    }
    if(this.props.quit){
      this.closeNav()
    }
    if(this.props.choosed){
      this.openNav()
    }

    if (this.state.item.Poster == "N/A" || !this.state.item.Poster) {
      this.state.item.Poster = "http://localhost:3000/app/data/poster_not_found.png"
    }



    if(this.props.type == "tv_shows"){
      data = this.state.item.episodes.map((item, i) => {
        return <Episode key={i} filename={item.filename} season={item.season} episode={item.episode}/>
      })
    }
    if(this.props.type == "untracked"){
      if (this.state.item.episodes != undefined) {
        data = this.state.item.episodes.map((item, i) => {
          return <Episode key={i} filename={item.filename} season={item.season} episode={item.episode}/>
        })
      }
    }


    return (
      <div style={{width: '300px', display: 'inline-block',margin: '15px'}} >
      <div  className="row text-center"  style={{}}>
      <a href="javascript:void(0)" onClick={this.openNav.bind(this)}>
      <img className={SelectedClass + " poster"} style={{width: 300 + 'px', height: 430 + 'px'}} src={this.state.item.Poster}/>
      </a>
      {!this.state.item.Plot &&
        <h4 className="col-md-8">{this.state.item.Title}</h4>
      }
      </div>
      <div id={"myNav"+this.state.item.Title} className="overlay">
      <div style={{marginRight: "200px", width: "100%"}}>
      <a href="javascript:void(0)" style={{fontSize: "70px", marginTop: "50px", marginRight:"20px"}} className="pull-right" onClick={this.closeNav.bind(this)}>&times;</a>
      <div className="col-sm-4">
      <img className="poster-info" style={{width:'100%', marginTop: "100px", marginLeft: "20px"}} src={this.state.item.Poster}/>
      </div>
      <div className="col-sm-8 text-left" style={{paddingRight: "60px",paddingLeft: "20px"}}>

      <h1 style={{marginTop: "-60px",marginBottom: "30px"}} className="text-center">{this.state.item.Title}</h1>
      {this.state.item.Director != "N/A" &&
      <p style={{color: "#f7f7f7", fontSize: "22px", margin: "2px", marginLeft: "20px", marginRight: "-20px"}}>Director : <b style={{fontSize: "20px"}} className="pull-right">{this.state.item.Director}</b></p>
    }
    {this.state.item.Writer != "N/A" && this.state.item.Director == "N/A" &&
    <p style={{color: "#f7f7f7", fontSize: "22px", margin: "2px", marginLeft: "20px", marginRight: "-20px"}}>Writer : <b style={{fontSize: "20px"}} className="pull-right">{this.state.item.Writer}</b></p>
  }
  <p style={{color: "#f7f7f7", fontSize: "22px", margin: "2px", marginLeft: "20px", marginRight: "-20px"}}>Genre : <b style={{fontSize: "20px"}} className="pull-right">{this.state.item.Genre}</b></p>
  <p style={{color: "#f7f7f7", fontSize: "22px", margin: "2px", marginLeft: "20px", marginRight: "-20px"}}>Year : <b style={{fontSize: "20px"}} className="pull-right">{this.state.item.Year}</b></p>
  <p style={{color: "#f7f7f7", fontSize: "22px", margin: "2px", marginLeft: "20px", marginRight: "-20px"}}>Runtime : <b style={{fontSize: "20px"}} className="pull-right">{this.state.item.Runtime}</b></p>
  <p style={{color: "#f7f7f7", fontSize: "22px", margin: "2px", marginLeft: "20px", marginRight: "-20px"}}>Actors : <b style={{fontSize: "20px"}} className="pull-right">{this.state.item.Actors}</b></p>
  <p style={{color: "#f7f7f7", fontSize: "22px", margin: "2px", marginLeft: "20px", marginRight: "-20px"}}>imdb Rating : <b style={{fontSize: "20px"}} className="pull-right">{this.state.item.imdbRating} / 10</b></p>
  {this.state.item.Metascore != "N/A" &&
  <p style={{color: "#f7f7f7", fontSize: "22px", margin: "2px", marginLeft: "20px", marginRight: "-20px"}}>Metascore : <b style={{fontSize: "20px"}} className="pull-right">{this.state.item.Metascore}%</b></p>
}
<div className="well" style={{marginTop: "30px", marginLeft: "20px", marginRight: "-20px", color: "#333"}}>
<p style={{fontSize: "18px"}}><b >{this.state.item.Plot}</b></p>
</div>

{this.state.item.Filename != undefined &&
  <button className="list-group-item list-group-item-action text-center" style={{textAlign: "center"}}  href="javascript:void(0)" onClick={this.exec_vlc.bind(this)}>
  <b>Lancer</b>
  <i style={{marginLeft: "15px"}} className="fa fa-play"></i>
  </button>
}

{this.props.type == "tv_shows"  &&
<div style={{minHeight: "100%"}}>
<h2 style={{marginLeft: "25px", marginBottom: "0px", marginTop: "40px"}}>Seasons </h2>
<div style={{marginLeft: "15px", marginTop: "10px"}}>{SeasonsList}</div>
<h2 style={{marginLeft: "25px", marginBottom: "5px", marginTop: "10px"}}>Episodes</h2>
<Seasons title={this.state.item.Title} season={this.state.season}/>
</div>
}

{this.props.type == "untracked" && this.state.item.episodes != undefined &&
<div style={{minHeight: "100%"}}>
<h2 style={{marginLeft: "25px", marginBottom: "0px", marginTop: "40px"}}>Seasons </h2>
<div style={{marginLeft: "15px", marginTop: "10px"}}>{SeasonsList}</div>
<h2 style={{marginLeft: "25px", marginBottom: "5px", marginTop: "10px"}}>Episodes</h2>
<Seasons title={this.state.item.Title} season={this.state.season} type="untracked"/>
</div>
}
</div>
</div>
</div>
</div>
)
}
}
