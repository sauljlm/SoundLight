// Load scripts.
import Player from './player';
import Singleton from './singleton';

// Load styles.
import '../scss/style.scss';
// Register service worker.
import './registerServiceWorker';

const cont = document.querySelector('#songs_container');
const singleton = new Singleton();
let heroBanner = null;
let player = null;

function showLoarding() {
  heroBanner = document.createElement('div');
  heroBanner.setAttribute('class', 'hero-banner');
  cont.appendChild(heroBanner);
}

function hideLoarding() {
  heroBanner.classList.add('hide-hero-banner');
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
