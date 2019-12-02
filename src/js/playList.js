import Singleton from './singleton';

export default class PlayList {
  constructor(player) {
    this.btnPlayList = document.querySelector('#btn-playlist');

    this.singleton = new Singleton();
    this.player = player;

    // EVENTS
    this.btnPlayList.addEventListener('click', this.startPlayList.bind(this));
  }
  
  startPlayList() {
    this.singleton.changeViewPlayList();
    this.singleton.generatePlayList();
    this.player.renderListSongs();
  }
}
