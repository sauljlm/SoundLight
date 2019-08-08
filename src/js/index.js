// Load scripts.
import Player from './player';
import Singleton from './singleton';

// Load styles.
import '../scss/style.scss';
// Register service worker.
import './registerServiceWorker';

const cont = document.querySelector('#songs_container');
const singleton = new Singleton();
let loarding = document.querySelector('.loarding');
let player = null;

function showLoarding() {
  loarding.classList.remove('hide-loarding');
}

function hideLoarding() {
  loarding.classList.add('hide-loarding');
}

function appStar() {
  player = new Player('#songs_container');
  console.log('player', player); // eslint-disable-line
}

function init() {
  showLoarding();
  setTimeout(appStar, 500);
  setTimeout(hideLoarding, 3000);
}

document.addEventListener('DOMContentLoaded', init);
