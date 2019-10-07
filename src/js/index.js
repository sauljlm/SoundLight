// Load scripts.
import Player from './player';
import Singleton from './singleton';
import PlayList from './playList';

// Load styles.
import '../scss/style.scss';
// Register service worker.
import './registerServiceWorker';

const singleton = new Singleton(); // eslint-disable-line
let player = null;
let playList = null; // eslint-disable-line

function appStar() {
  player = new Player('#songs_container');
  playList = new PlayList(player);
}

function init() {
  setTimeout(appStar, 500);
}

document.addEventListener('DOMContentLoaded', init);
