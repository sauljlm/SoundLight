import Singleton from './singleton';

export default class UI {
  constructor() {
    // elements
    this.contPlayer = document.querySelector('#song');
    this.btnClose = document.querySelector('#btn-close');
    this.btnShowPlayer = document.querySelector('#show-player');
    this.contCover = document.querySelector('#song-cover');
    this.contName = document.querySelector('#active-song-name');
    this.contArtist = document.querySelector('#song-artist');
    this.contSongs = document.querySelector('#songs-list');
    this.contActiveName = document.querySelector('#song-name');
    this.btnPlayActiveSong = document.querySelector('#active-song-btn-play');
    this.playerBtnPlay = null;

    // instances
    this.singleton = new Singleton();

    // events
    this.btnClose.addEventListener('click', () => {
      this.contPlayer.classList.toggle('song--hide');
    });

    this.btnShowPlayer.addEventListener('click', () => {
      this.contPlayer.classList.toggle('song--hide');
    });
  }

  render(songData) {
    this.contCover.setAttribute('src', `img/covers/${songData.cover}`);
    this.contCover.setAttribute('alt', `cover of ${songData.title}`);
    this.contName.innerHTML = `${songData.title}`;
    this.contActiveName.innerHTML = `${songData.title}`;
    this.contArtist.innerHTML = `${songData.artist}`;
  }

  renderPlayer() {
    const player = document.createElement('div');
    player.classList.add('player');

    return player;
  }

  renderRandomBtn() {
    const randomBtn = document.createElement('button');
    randomBtn.classList.add('player__btn-random');
    randomBtn.setAttribute('aria-label', 'button-random');

    return randomBtn;
  }

  renderRepeatBtn() {
    const repeatBtn = document.createElement('button');
    repeatBtn.classList.add('player__btn-repeat');
    repeatBtn.setAttribute('aria-label', 'button-repeat');

    return repeatBtn;
  }

  renderPlayBtn() {
    const playBtn = document.createElement('button');
    playBtn.classList.add('player__btn-play', 'btn-play');
    playBtn.setAttribute('aria-label', 'button-play');
    this.playerBtnPlay = playBtn;

    return playBtn;
  }

  renderPreviousBtn() {
    const previousBtn = document.createElement('button');
    previousBtn.classList.add('player__btn-back');
    previousBtn.setAttribute('aria-label', 'button-back');

    return previousBtn;
  }

  renderNextBtn() {
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('player__btn-next');
    nextBtn.setAttribute('aria-label', 'button-next');

    return nextBtn;
  }

  renderControls() {
    const controls = document.createElement('div');
    controls.classList.add('player__controls');

    return controls;
  }

  renderSliderInput() {
    const input = document.createElement('input');
    input.setAttribute('name', 'slider-bar');
    input.setAttribute('id', 'slider-bar');

    input.type = 'range';
    input.disabled = true;
    input.min = 0;
    input.max = 100;
    input.value = 0;
    return input;
  }

  renderSlideLabel() {
    const sliderLabel = document.createElement('label');

    sliderLabel.innerHTML = 'slider bar';

    sliderLabel.setAttribute('class', 'sr-only');
    sliderLabel.setAttribute('for', 'slider-bar');

    return sliderLabel;
  }

  renderSlider() {
    const colSlider = document.createElement('div');
    colSlider.classList.add('player__slider');

    return colSlider;
  }

  renderColTime() {
    const colTime = document.createElement('p');
    colTime.classList.add('player__time');

    return colTime;
  }

  renderColDur() {
    const colDuration = document.createElement('p');
    colDuration.classList.add('player__duration');

    return colDuration;
  }

  renderTimer() {
    const row = document.createElement('div');
    row.classList.add('player__timer');

    return row;
  }

  renderContSongs() {
    const container = document.createElement('ul');
    container.setAttribute('class', 'songs-list__cont');

    return container;
  }

  cleanSongListClass() {
    document.querySelectorAll('.song').forEach((element) => {
      element.classList.remove('songs-list__item--active');
    });
  }

  renderSongsList(dataSongs, song, index) {
    const item = document.createElement('li');
    item.setAttribute('data-id', `${dataSongs[index]._id}`);
    item.setAttribute('id', `${index}`);
    item.setAttribute('dataSong', `${dataSongs[index].dataSong}`);
    item.setAttribute('class', 'songs-list__item clearfix');
  
    const title = document.createElement('p');
    title.innerHTML = `${song.title} - ${song.artist}`;
  
    item.appendChild(title);
  
    return item;
  }

  clearContSongs() {
    this.contSongs.innerHTML = '';
  }

  renderUIBtnFavorite(favorite) {
    const btnAdd = document.createElement('button');

    btnAdd.setAttribute('class', 'songs-list__btn-fav');
    btnAdd.setAttribute('aria-label', 'btn add to playlist');

    if (favorite) {
      btnAdd.classList.add('songs-list__btn-fav--active');
    }

    return btnAdd;
  }

  updateUIBtnFavorite(btnAdd) {
    btnAdd.classList.toggle('songs-list__btn-fav--active');
  }

  updateUISongActive(songSelected) {
    const songs = document.querySelectorAll('.songs-list__item');
    songs.forEach((song, index) => {
      song.classList.remove('songs-list__item--active');
      if (songSelected === index) {
        song.classList.add('songs-list__item--active');
      }
    });
  }

  togglePlayBtn(playing) {
    if (playing) {
      this.btnPlayActiveSong.classList.add('btn-pause');
      this.playerBtnPlay.classList.add('btn-pause');
    } else {
      this.btnPlayActiveSong.classList.remove('btn-pause');
      this.playerBtnPlay.classList.remove('btn-pause');
    }
  }

  toggleRandomIcon() {
    this.randomIcon.classList.toggle('player__btn-random--active');
  }

  toggleRepeatIcon() {
    this.repeatIcon.classList.toggle('player__btn-repeat--active');
  }

  cleanContainer(container) { // eslint-disable-line
    container.innerHTML = ''; // eslint-disable-line
  }
}
