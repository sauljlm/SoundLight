const express = require('express');
const router = express.Router();
const Post = require('../models/schemas');

// get all
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(posts);
  } 
  catch(err) {
    res.json({message: err});
  }
});

// get one
router.get('/:Id', async (req, res) => {
  try{
    const post = await Post.findById(req.params.Id);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(post);
  }
  catch(err) {
    res.json({message: err});
  }
});

// insert
router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    artist: req.body.artist,
    cover: req.body.cover,
    mp3: req.body.mp3,
    favorite: req.body.favorite,
    dataSong: req.body.dataSong,
  });
  try {
    const savedPost = await post.save()
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(savedPost);
  }
  catch(err) {
    res.json({message: err});
  }
});

// delete one
router.delete('/:Id', async (req, res) => {
  try {
    const removeId = await Post.remove({_id: req.params.Id });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(removeId);
  }
  catch(err) {
    res.json({message: err});
  }
});

// update one
router.patch('/:Id', async (req, res) => {
  try {
    const updateId = await Post.updateOne(
      {_id: req.params.Id },
      { $set: {favorite: req.body.favorite}
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(updateId);
  }
  catch(err) {
    res.json({message: err});
  }
});

module.exports = router;
