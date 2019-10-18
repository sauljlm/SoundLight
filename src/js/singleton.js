let instance = null;
export default class Singleton {
  constructor() {
    this.DATA = null;
    this.playList = [];
    this.playing = 0;
    this.viewPlayList = false;
    this.url = 'http://localhost:1234';

    if (!instance) {
      instance = this;
    }
    return instance;
  }

  get getViewPlayList() {
    return this.viewPlayList;
  }

  get getPlaying() {
    return this.playing;
  }

  set setPlaying(value) {
    this.playing = value;
  }

  get getSongs() {
    return this.DATA;
  }

  get getPlayList() {
    return this.playList;
  }

  get getRandomSong() {
    const random = Math.round(Math.random() * (this.DATA.length - 0) + 0);
    this.playing = random;
    return this.DATA[random];
  }

  async loadData() {
    const response = await fetch(this.url);
    const data = await response.json();
    this.DATA = data;
  }

  getOne(index) {
    let song = null;
    song = this.DATA[index];
    return song;
  }

  getRandom(random) {
    let song = null;
    if (random === true) {
      song = this.getRandomSong;
    } else {
      song = this.DATA[this.playing];
    }
    return song;
  }

  getNext(random, next = this.playing) {
    let song = null;
    if (random === true) {
      song = this.getRandomSong;
    } else {
      song = this.DATA[next];
      this.playing = next;
    }
    return song;
  }

  getPrevious(random, previous = this.playing) {
    let song = null;
    if (random === true) {
      song = this.getRandomSong;
    } else {
      song = this.DATA[previous];
      this.playing = previous;
    }
    return song;
  }

  changeViewPlayList() {
    this.viewPlayList = !this.viewPlayList;
  }

  emptyPlaylist() {
    this.playList = [];
  }

  generatePlayList() {
    this.emptyPlaylist();
    this.DATA.forEach((element) => {
      if (element.favorite) {
        this.playList.push(element);
      }
    });
  } 

  // post
  update(Id, index) {
    return new Promise(resolve => {
      fetch(`${this.url}/${Id}`, {
        method: 'PUT',
        body: JSON.stringify({ favorite : !this.DATA[index].favorite }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then(response => response.json())
      .then(() => this.loadData())
      .then(() => { resolve() })
    });
  }
}
