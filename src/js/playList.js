import Singleton from './singleton';

export default class PlayList {
  constructor(player) {
    this.btnPlayList = document.querySelector('.js-btn-playlist');

    this.singleton = new Singleton();
    this.player = player;
    this.songData = null;

    // EVENTS
    this.btnPlayList.addEventListener('click', this.startPlayList.bind(this));
    this.songData = this.singleton.getPlayList;
  }

  startPlayList() {
    this.singleton.changeViewPlayList();
    this.singleton.generatePlayList();
    this.player.renderListSongs();
  }
}
