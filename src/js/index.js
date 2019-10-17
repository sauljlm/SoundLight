// Load scripts.
import Player from './player';
import Singleton from './singleton';
import PlayList from './playList';
import UI from './UI';

// Load styles.
import '../scss/style.scss'; 
// Register service worker.
import './registerServiceWorker';

let singleton = new Singleton(); // eslint-disable-line
let player = null;
let playList = null; // eslint-disable-line

function appStar() {
  player = new Player();
  player.startRender();
  playList = new PlayList(player);
}

async function init() {
  await singleton.loadData();
  appStar();
}

document.addEventListener('DOMContentLoaded', init);
