// import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Load styles.
import '../scss/style.scss';

// Register service worker.
import './registerServiceWorker';

function getSongs(data) {
  console.log(data);
}

function getJson(url, funct) {
  fetch(url)
    .then((data) => { return data.json(); })
    .then((data) => {
      if (typeof funct === 'function') {
        funct(data);
      }
    });
}

window.onload = function initial() {
  getJson('./songs.json', getSongs);
};
