const mongoose = require('mongoose');

const PostShema = mongoose.Schema({
  title: {
    type: String,
    required: true
  }, 
  artist: {
    type: String,
    required: true
  },
  cover: {
    type: String,
    required: true
  },
  mp3: {
    type: String,
    required: true
  },
  favorite: {
    type: Boolean,
    required: true
  },
  dataSong: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Posts', PostShema);