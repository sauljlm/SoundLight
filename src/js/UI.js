import Singleton from './singleton';

export default class UI {
  constructor() {
    // elements
    this.contPlayer = document.querySelector('.song_cover');
    this.btnClose = document.querySelector('.btn-close');
    this.btnShowPlayer = document.querySelector('.show-player');
    this.contCover = document.querySelector('.cover');
    this.contName = document.querySelector('.song_name_active');
    this.contArtist = document.querySelector('.song_artist');
    this.contSongs = document.querySelector('.songs_list');
    this.contActiveName = document.querySelector('.song_name');
    this.contActivePlay = document.querySelector('.play_button');

    // instances
    this.singleton = new Singleton();

    // events
    this.btnClose.addEventListener('click', () => {
      this.contPlayer.classList.toggle('hide-player');
    });

    this.btnShowPlayer.addEventListener('click', () => {
      this.contPlayer.classList.toggle('hide-player');
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
    randomBtn.classList.add('random');
    randomBtn.setAttribute('aria-label', 'button-random');

    return randomBtn;
  }

  renderRepeatBtn() {
    const repeatBtn = document.createElement('button');
    repeatBtn.classList.add('repeat');
    repeatBtn.setAttribute('aria-label', 'button-repeat');

    return repeatBtn;
  }

  renderPlayBtn() {
    const playBtn = document.createElement('button');
    playBtn.classList.add('play');
    playBtn.setAttribute('aria-label', 'button-play');

    return playBtn;
  }

  renderPreviousBtn() {
    const previousBtn = document.createElement('button');
    previousBtn.classList.add('back');
    previousBtn.setAttribute('aria-label', 'button-back');

    return previousBtn;
  }

  renderNextBtn() {
    const nextBtn = document.createElement('button');
    nextBtn.classList.add('next');
    nextBtn.setAttribute('aria-label', 'button-next');

    return nextBtn;
  }

  renderControls() {
    const controls = document.createElement('div');
    controls.classList.add('controls');

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
    colSlider.classList.add('slider');

    return colSlider;
  }

  renderColTime() {
    const colTime = document.createElement('p');
    colTime.classList.add('time');

    return colTime;
  }

  renderColDur() {
    const colDuration = document.createElement('p');
    colDuration.classList.add('duration');

    return colDuration;
  }

  renderTimer() {
    const row = document.createElement('div');
    row.classList.add('timer');

    return row;
  }

  renderContSongs() {
    const container = document.createElement('ul');
    container.setAttribute('class', 'songs');

    return container;
  }

  cleanSongListClass() {
    document.querySelectorAll('.song').forEach((element) => {
      element.classList.remove('song-active');
    });
  }

  renderSongsList(dataSongs, song, index) {
    const item = document.createElement('li');
    item.setAttribute('id', `${index}`);
    item.setAttribute('dataSong', `${dataSongs[index].dataSong}`);
    item.setAttribute('class', 'song clearfix');
  
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

    btnAdd.setAttribute('class', 'add_button');
    btnAdd.setAttribute('aria-label', 'btn add to playlist');

    if (favorite) {
      btnAdd.classList.add('add_button-active');
    }

    return btnAdd;
  }

  updateUIBtnFavorite(btnAdd, favorite) {
    if (favorite) {
      btnAdd.classList.add('add_button-active');
    } else {
      btnAdd.classList.remove('add_button-active');
    }
  }

  updateUISongActive(songSelected) {
    const songs = document.querySelectorAll('.song');
    songs.forEach((song, index) => {
      song.classList.remove('song-active');
      if (songSelected === index) {
        song.classList.add('song-active');
      }
    });
  }

  toggleUiPlayBtn(playing, playBtn) {
    if (playing) {
      this.contActivePlay.classList.remove('btn-active');
      playBtn.classList.remove('btn-active');
    } else {
      this.contActivePlay.classList.add('btn-active');
      playBtn.classList.add('btn-active');
    }
  }

  toggleRandomIcon() {
    this.randomIcon.classList.toggle('random-active');
  }

  toggleRepeatIcon() {
    this.repeatIcon.classList.toggle('repeat-active');
  }

  cleanContainer(container) { // eslint-disable-line
    container.innerHTML = ''; // eslint-disable-line
  }
}
