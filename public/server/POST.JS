const songs = require('./bd/songs.json');
const querystring = require('querystring');
const fs = require('fs');

function processData(req, res, file, url) {
  let data = '';
  req
    .on('data', d => data += d)
    .on('end', () => {
      data = querystring.parse(data);
      if(validateCar(data.title, data.artist, data.cover, data.song)) { 
        data = addDefaults(data.title, data.artist, data.cover, data.song);
        writeData(res, file, url, data);
      } else {
        res.end(`los valores ${res} no son validos`);
      }
    });
}

function writeData(res, file, url, data) {
  file.push(data);
  fs.writeFile(`${url}`, JSON.stringify(file), err => {if(err) throw new Error(err)});
  res.end(JSON.stringify(data));
}

function validateCar(title, artist, cover, song) {
  if(title && artist && cover && song) {
    return true;
  } else {
    return false;
  }
}

function generateID() {
  const id = Math.floor((Math.random() * (999)) + 100);
  return id;
}

function generateDate() {
  let date = new Date();
  date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return date;
}

function addDefaults(title, artist, cover, song, started) {
  let DATA = {
    id: generateID(),
    title: title,
    artist: artist,
    cover: cover,
    song: song,
    started: started,
    dataSong: title
  }
  if(!started) {DATA.started = false};
  return DATA;
}

function POST(req, res) {
  if (req.url === '/api/v1/songs') {
    processData(req, res, songs, './bd/songs.json');
  } else {
    res.end(`la ruta ${req.url} no fue encontrada`);
  }
}

module.exports = POST; 