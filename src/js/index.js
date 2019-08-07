// Load scripts.
import Player from './player';

// Load styles.
import '../scss/style.scss';

// Register service worker.
import './registerServiceWorker';

// const singleton = new Singleton();
// const player = new Player('.cont-audio');
// const IMPORT = new Import();

(function initial() {
  let player = null;
  function init() {
    player = new Player('#container', 'On%20Melancholy%20Hill');
    console.log('player', player); // eslint-disable-line
  }

  document.addEventListener('DOMContentLoaded', init);
}());
