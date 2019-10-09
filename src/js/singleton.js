let instance = null;
export default class Singleton {
  constructor() {
    this.DATA = null;
    this.playList = [];
    this.playing = 0;
    this.viewPlayList = false;

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

  set setFavorite(index) {
    if (this.viewPlayList) {
      this.playList[index].favorite = !this.playList[index].favorite;
    } else {
      this.DATA[index].favorite = !this.DATA[index].favorite;
    }
  }

  get getRandomSong() {
    const random = Math.round(Math.random() * (this.DATA.length - 0) + 0);
    this.playing = random;
    return this.DATA[random];
  }

  async loadData() {
    const URI = 'songs.json';
    const response = await fetch(URI);
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
}
