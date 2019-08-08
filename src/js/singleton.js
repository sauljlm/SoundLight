let instance = null;
export default class Singleton {
  constructor() {
    this.DATA = null;
    this.getJson();
    this.playing = 0;

    if (!instance) {
      instance = this;
    }
    return instance;
  }

  getJson(url = 'songs.json') {
    fetch(url)
      .then(data => data.json())
      .then((data) => {
        this.DATA = data;
      });
  }

  get getPlaying() {
    return this.playing;
  }

  get getSongs() {
    return this.DATA;
  }

  get getRandomSong() {
    const random = Math.round(Math.random() * (this.DATA.length - 0) + 0);
    this.playing = random;
    return this.DATA[random].mp3;
  }

  getOne(random) {
    let song = null;
    if (random === true) {
      song = this.getRandomSong;
    } else {
      song = this.DATA[this.playing].mp3;
    }
    return song;
  }

  getNext(random, next = this.playing) {
    let song = null;
    if (random === true) {
      song = this.getRandomSong;
    } else {
      song = this.DATA[next].mp3;
      this.playing = next;
    }
    return song;
  }

  getBack(random, back = this.playing) {
    let song = null;
    if (random === true) {
      song = this.getRandomSong;
    } else {
      song = this.DATA[back].mp3;
      this.playing = back;
    }
    return song;
  }
}
