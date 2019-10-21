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

  async loadData() {
    const response = await fetch(this.url);
    const data = await response.json();
    this.DATA = data;
  }

  getActiveList() {
    let songList = null;
    if (this.getViewPlayList) {
      songList = this.getPlayList;
    } else {
      songList = this.getSongs;
    }
    return songList;
  }

  getOne(id) {
    const songList = this.getActiveList();
    let song = null;

    songList.forEach((element, index) => {
      if(element._id === id) {
        song = songList[index];
      }
    });
    return song;
  }

  getRandom(random) {
    const songList = this.getActiveList();
    let song = null;
    if (random === true) {
      const random = Math.round(Math.random() * (songList.length - 0) + 0);
      this.playing = songList[random]._id;
      song = songList[random];
    } else {
      song = this.getNext();
    }
    return song;
  }

  getNext(random, id) {
    const songList = this.getActiveList();
    let song = null;
    if (random === true) {
      song = this.getRandom(true);
    } else if (!id) {
      song = songList[0];
      this.playing = songList[0]._id;
    } else {
      songList.forEach((e,i) => {
        if (e._id === id) {
          song = songList[i];
          this.playing = id;
        }
      });
    }
    return song;
  }

  getPrevious(random, id) {
    const songList = this.getActiveList();
    let song = null;
    if (random === true) {
      song = this.getRandom(true);
    } else {
      songList.forEach((e,i) => {
        if (e._id === id) {
          song = songList[i];
          this.playing = id;
        }
      });
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
