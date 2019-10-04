import Singleton from './singleton';

export default class PlayList {
  constructor(player) {
    this.btnPlayList = document.querySelector('.js-btn-playlist');

    this.singleton = new Singleton();
    this.player = player;
    this.songData = null;

    this.view = false;

    // EVENTS
    this.btnPlayList.addEventListener('click', this.generatePlayList.bind(this));
    this.songData = this.singleton.getPlayList;
  }

  changeView() {
    this.view = !this.view;
  }

  generatePlayList() {
    this.changeView();

    this.singleton.setViewPlayList = this.view;

    this.singleton.generatePlayList();

    this.player.composeList();
  }
}
