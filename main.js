// NetFreaks - Media Center under GPLv3
// Copyright (C) 2018  Gabriel Franck
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

'use strict';

/**
* Module dependencies.

*/
const electronLocalshortcut = require('electron-localshortcut');
var electron = require('electron');
var path = require('path');
var fs = require('fs');
var {exec} = require("child_process");
const {ipcMain, dialog} = require('electron')
var tnp = require('torrent-name-parser');
const http = require('http');

const Store = require('electron-store');
const store = new Store();

console.log(store.get('config.MainFolder'))


// debug
if (process.env.NODE_ENV === 'development') {
  require('electron-debug')({
    showDevTools: true
  });
}


/**
* Create the main browser window.
*/
// Warn if overriding existing method
if(Array.prototype.equals)
console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array)
  return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length)
  return false;

  for (var i = 0, l=this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i]))
      return false;
    }
    else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

function writeListFilesFile(medias) {
  return new Promise(function(resolve) {
    var obj = []
    let json
    store.set('files', medias)
    resolve(medias)
  });
}

function makeListFiles(dir, filelist) {
  var fs = fs || require('fs'),
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = makeListFiles(dir + '/' + file, filelist);
    }
    else {
      if (!file.match(/.part$/) && !file.match(/.json$/) ) {
        filelist.push({name: file, fullpath: dir + '/' + file});
      }
    }
  });
  return filelist;
};

function formatString(string){
  if (string){
    let result = string.toLowerCase();
    result = result.replace(/[[^a-zA-Z0-9]\s]/g, '');
    result = result.replace(/-/g, '');
    result = result.replace(/:/g, '');
    result = result.replace(/  /g, ' ');
    result = result.replace(/ /g, '.');
    return result
  }
  return

}

function filterTypes(accepted, types){
  var result = {};
  for (var type in types)
  if (accepted.indexOf(type) > -1)
  result[type] = types[type];
  return result;
}

function tvShowsWriteJson(tvshows) {
  return new Promise(function(resolve) {

    let tvshowslist = []
    let untrackedlist = []
    let itemsPromises = []
    let itemsWaitingForPromises = []


    tvshows.map((item,i) => {
      if(!item.season){
        item.season = "00"
      }
      if ( tvshowslist.filter(function(vendor){ return formatString(vendor.title) == formatString(item.title) }).length == 0 ) {
        if (untrackedData.filter(function(m){ return formatString(m.Title) == formatString(item.title) }).length == 0) {
          if (tv_showsData.filter(function(t){ return formatString(t.Title) == formatString(item.title) }).length != 0) {
            let datatvshow = tv_showsData.filter(function(j){ return formatString(j.Title) == formatString(item.title) })
            if(datatvshow[0].episodes){
              if( datatvshow[0].episodes.filter(function(k){ return k.filename == item.filename}).length == 0){
                datatvshow[0].episodes.push({"season": item.season, "episode": item.episode,"filename": item.filename})
              }
            }else {
              datatvshow['episodes'] = []
              datatvshow[0].episodes.push({"season": item.season, "episode": item.episode,"filename": item.filename})
              // datatvshow.episodes.push({"season": item.season, "episode": item.episode,"filename": item.filename})
            }
            tvshowslist = tvshowslist.filter(function(n){ return formatString(n.Title) != formatString(item.title) })
            tvshowslist.push(datatvshow[0])
          }
          else {
            if(itemsWaitingForPromises.filter(function(vendor){ return formatString(vendor.Title) == formatString(item.title) }).length != 0 ){
              if(itemsWaitingForPromises[0].episodes){
                itemsWaitingForPromises[0].episodes.push({"season": item.season, "episode": item.episode,"filename": item.filename})
              }
            }else {
              itemsWaitingForPromises.push({"Title": item.title, "episodes": [{"season": item.season, "episode": item.episode,"filename": item.filename}]})

              let promiseTemp = new Promise(function(resolve) {
                http.get("http://www.omdbapi.com/?t="+item.title+"&apikey=ae861c26", res => {
                  res.setEncoding("utf8");
                  let body = "";
                  res.on("data", data => {
                    body += data;
                  });
                  res.on("end", () => {
                    body = JSON.parse(body);
                    body['episodes'] = [{"season": item.season, "episode": item.episode,"filename": item.filename}]
                    console.log("================ Request ================");
                    console.log(body);
                    if (body.Response == "True") {
                      body.Poster = body.Poster.replace('SX300', 'SX800')
                      tvshowslist.push(body)
                      resolve()
                    }else {
                      untrackedlist.push({"Title": item.title, "episodes": [{"season": item.season, "episode": item.episode,"filename": item.filename}]})
                      resolve()
                    }
                  });
                });
              })
              itemsPromises.push(promiseTemp)
            }



          }
        }else {
          let tempUntrackedList = untrackedData.filter(function(n){ return formatString(n.Title) == formatString(item.title) })
          if(tempUntrackedList[0].episodes){
            if( tempUntrackedList[0].episodes.filter(function(k){ return k.filename == item.filename}).length == 0){
              tempUntrackedList[0].episodes.push({"season": item.season, "episode": item.episode,"filename": item.filename})
            }
          }
          untrackedlist = untrackedData.filter(function(n){ return formatString(n.Title) != formatString(item.title) })
          untrackedlist.push(tempUntrackedList[0])
        }
      }
      else {
        let toto = tvshowslist.filter(function(vendor){ return formatString(vendor.title) == formatString(item.title) })
        toto[0].episodes.push({"season": item.season, "episode": item.episode,"filename": item.filename})

        tvshowslist = tvshowslist.filter(function(t){ return formatString(t.Title) != formatString(item.title)})
        tvshowslist.push(toto[0])
      }
    })

    Promise.all(itemsPromises).then( () => {

      store.set('tvShows', tvshowslist)
      console.log("===================== TV SHOWS =======================");
      // console.log(store.get('tvShows'))
      resolve(untrackedlist)
    })

  })
}


function filmsWriteJson(films) {
  return new Promise(function(resolve) {


    let filmslist = []
    let untrackedlist = []
    let itemsPromises = []
    films.map((item,i) => {
      if ( filmslist.filter(function(n){ return formatString(n.Title) == formatString(item.title) }).length == 0 ) {
        if (untrackedData.filter(function(m){ return m.Filename == item.filename }).length == 0) {
          if (filmsData.filter(function(t){ return t.Filename == item.filename }).length != 0) {
            let datafilm = filmsData.filter(function(t){ return t.Filename == item.filename })
            filmslist.push(datafilm[0])
          }else {
            let promiseTemp = new Promise(function(resolve) {
              let filmYear
              if (item.year) {
                filmYear = "&y="+ item.year
              }else {
                filmYear = ""
              }

              http.get("http://www.omdbapi.com/?t="+formatString(item.title)+filmYear+"&apikey="+store.get('config.ApiKey'), res => {
                res.setEncoding("utf8");
                let body = "";
                res.on("data", data => {
                  body += data;
                });
                res.on("end", () => {
                  body = JSON.parse(body);
                  body['Filename'] = item.filename
                  if (body.Response == "True") {
                    body.Poster = body.Poster.replace('SX300', 'SX800')
                    console.log(body);
                    filmslist.push(body)
                    resolve()
                  }else {
                    let unntrackedItem = {}
                    unntrackedItem['Filename'] = item.filename
                    unntrackedItem['Title'] = item.title
                    untrackedlist.push(unntrackedItem);
                    resolve()
                  }
                });
              });
            })
            itemsPromises.push(promiseTemp)
          }
        }else {
          let datauntracked = untrackedData.filter(function(t){ return t.Filename == item.filename })
          untrackedData = untrackedData.filter(function(t){ return t.Filename != item.filename })
          untrackedlist.push(datauntracked[0]);
        }
      }
    })

    Promise.all(itemsPromises).then( () => {
      store.set('films', filmslist)
      console.log("===================== FILMS =======================");
      // console.log(store.get('films'))
      resolve(untrackedlist)
    })
  })
}

function writeMediasFile(files) {
  return new Promise(function(resolve) {
    let tvshows

    let films

    files = files.map((item, i) => {
      let result = tnp(item.name)
      result['filename'] = item.fullpath
      return result
    })

    tvshows = files.filter((item) => item.season != null || item.episode != null)
    films = files.filter((item) => item.season == null && item.episode == null)

    Promise.all([filmsWriteJson(films),tvShowsWriteJson(tvshows)]).then((results) => {
      let untrackedlist = results[1].concat(results[0])

      console.log("===================== Untracked =======================");
      console.log(untrackedlist);
      store.set('untracked', untrackedlist)
      resolve()
    })
  })
}

var mainWindow;
function createWindow() {


  mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      experimentalFeatures: true
    }
  });



  mainWindow.setMenu(null);

  mainWindow.loadURL(
    path.join('file://', __dirname, '/app/index.html')
  );


  // electronLocalshortcut.register(mainWindow, 'up', () => {
  //   console.log('up');
  //   mainWindow.webContents.send('up' , {msg:'up'});
  // });
  // electronLocalshortcut.register(mainWindow, 'down', () => {
  //   console.log('down');
  //   mainWindow.webContents.send('down' , {msg:'down'});
  // });
  // electronLocalshortcut.register(mainWindow, 'left', () => {
  //   console.log('left');
  //   mainWindow.webContents.send('left' , {msg:'left'});
  // });
  // electronLocalshortcut.register(mainWindow, 'right', () => {
  //   console.log('right');
  //   mainWindow.webContents.send('right' , {msg:'right'});
  // });
  // electronLocalshortcut.register(mainWindow, 'enter', () => {
  //   console.log('enter');
  //   mainWindow.webContents.send('enter' , {msg:'enter'});
  // });
  // electronLocalshortcut.register(mainWindow, 'esc', () => {
  //   console.log('esc');
  //   mainWindow.webContents.send('esc' , {msg:'esc'});
  // });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
};


function createConfig() {
  if (store.get('config.MainFolder') == "" || store.get('config.MainFolder') == undefined) {
    dialog.showOpenDialog({properties: ['openDirectory']},function (fileNames) {

      console.log(fileNames[0]);
      store.set('config.MainFolder', fileNames[0])

      var files = writeListFilesFile(makeListFiles(fileNames[0])).then(function(files) {
        // console.log(files);
        writeMediasFile(files).then(()=>{
          createWindow()
        });
      })
    });
  }else {
    var files = writeListFilesFile(makeListFiles(store.get('config.MainFolder'))).then(function(files) {
      // console.log(files);
      writeMediasFile(files).then(()=>{
        createWindow()
      });
    })
  }
}
/**
* App.
*/
electron.app.on('ready', createConfig);

electron.app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

electron.app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});


ipcMain.on('reload-data', (event, arg) => {
  console.log("reloading");
  var files = writeListFilesFile(makeListFiles(store.get('config.MainFolder'))).then(function(files) {
    // console.log(files);
    writeMediasFile(files).then(()=>{
      mainWindow.reload()
      // createWindow()
    });
  })
  event.returnValue = 'pong'
})

ipcMain.on('change-folder', (event, arg) => {
  dialog.showOpenDialog({properties: ['openDirectory']},function (fileNames) {

    console.log( fileNames[0]);
    store.set('config.MainFolder', fileNames[0])

    var files = writeListFilesFile(makeListFiles(fileNames[0])).then(function(files) {
      // console.log(files);
      writeMediasFile(files).then(()=>{
        mainWindow.reload()
      });
    })
  });
  event.returnValue = 'pong'
})
ipcMain.on('vlc-exec', (event, arg) => {
  let vlc
  if (process.platform == 'darwin') {
    vlc = "/Applications/VLC.app/Contents/MacOS/VLC"
  }else if (process.platform == 'win32') {
    vlc = "'C:\\Program Files\\VideoLAN\\VLC\\VLC.exe'"
  }else if (process.platform == 'linux') {
    vlc = "vlc"
  }
  // need format arg
  fs.readFile(arg+".part", function readFile(err, data){
    if (err) {
      console.log(vlc + " --play-and-exit -f '"+ arg+"'")
      exec(vlc + " --play-and-exit -f '"+ arg+"'")
      event.returnValue = 'pong'
    }else {
      console.log(vlc + " --play-and-exit -f '"+ arg+".part'");
      exec(vlc + " --play-and-exit -f '"+ arg+".part'")
      event.returnValue = 'pong'
    }
  })
})
