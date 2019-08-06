// import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Load styles.
import '../scss/style.scss';

// Register service worker.
import './registerServiceWorker';

// function sendForm(data, url) {
//   let params = new URLSearchParams();
//   data.forEach((element, index) => {
//     params.append(element.name, data[index].value);
//   });
//   fetch(`${url}`, {
//     method: 'POST',
//     body: params.toString()
//   })
// }

function getSongs(data) {
  console.log(data);
}

function getJson(url, funct) {
  fetch(url)
    .then((data) => {
      return data.json()
    })
    .then((data) => {
      if (typeof funct === 'function') {
        funct(data);
      }
    });
}

window.onload = function () {
  getJson('./songs.json', getSongs);
};
