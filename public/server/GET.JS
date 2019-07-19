const songs = require('./bd/songs.json');

function GET(req, res) {
  if (req.url === '/api/v1/songs') {
    router(res, {success: true, data: songs});
  } else {
    res.end(`la ruta ${req.url} no fue encontrada`);
  }
}

function router(res, {success = false, error = null, data = null, status = 200}) {
  res.statusCode = status;
  res.end(JSON.stringify({success, data, error}));
}

module.exports = GET;