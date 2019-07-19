const fs = require('fs');
let songs = require('./bd/songs.json');

function DELETE(req, res) {
  if(req.url.indexOf('/api/v1/songs') > -1) {
    let id = +req.url.split('songs/')[1];
    songs.splice(id -1, 1);
    songs = songs.map((element, index) => {
      element.id = index + 1;
      return element;
    });
    if(songs[id]) {
      fs.writeFile('./bd/songs.json', JSON.stringify(songs),
      err => {if (err) throw new Error(err)});
      router(res, {success: true, data: songs});
    } else {
      router(res, {error: 'no se encontró el Id' , status: 404});
    }
  } else {
    router(res, {error: 'not resource found' , status: 404});
  }
}

function router(res, {success = false, error = null, data = null, status = 200}) {
  res.statusCode = status;
  res.end(JSON.stringify({success, data, error}));
}

module.exports = DELETE;