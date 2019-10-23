import Singleton from './singleton';
import UI from './UI';

export default class Player {
  constructor() {
    this.btnPlayActiveSong = document.querySelector('#active-song-btn-play');
    this.contPlayer = document.querySelector('#song');
    this.contSongs = document.querySelector('#songs-list');

    this.pathUrl = 'https://sauljlm.github.io/songs-data';

    // instances
    this.singleton = new Singleton();
    this.audio = null;
    this.UI = null;
    this.songData = null;

    // elements
    this.randomBtn = null;
    this.playBtn = null;
    this.repeatBtn = null;
    this.previousBtn = null;
    this.nextBtn = null;
    this.timeElement = null;
    this.sliderElement = null;
    this.sliderLabel = null;
    this.durationElement = null;
    this.songSelected = null;

    // values
    this.random = false;
    this.playingState = false;
    this.loaded = false;
    this.repeat = false;
    this.TIME = 0;
    this.playingIndex = 0;
  }

  get time() {
    return Player.FormatTime(this.audio.currentTime);
  }

  set time(value) {
    this.TIME = value;
    this.sliderElement.value = (this.TIME * 100) / this.audio.duration;
    this.timeElement.innerText = this.time;
  }

  get duration() {
    return Player.FormatTime(this.audio.duration);
  }

  static FormatTime(time) {
    if (time === 0) return '00:00';
    const secs = Math.round(time);

    const minutesDivisor = secs % (60 * 60);
    let minutes = Math.floor(minutesDivisor / 60);

    const secondsDivisor = minutesDivisor % 60;
    let seconds = Math.ceil(secondsDivisor);

    if (minutes < 10) {
      minutes = `0${minutes}`;
    } else {
      minutes = '00';
    }
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  }

  startRender() {
    this.audio = new Audio();
    this.UI = new UI();

    this.renderPlayer();
    this.renderListSongs();
    this.load(this.singleton.getNext(this.random));
    this.setSongActive();
    this.UI.render(this.songData);

    this.audio.addEventListener('loadeddata', () => {
      this.loaded = true;
      this.timeElement.innerText = this.time;
      this.sliderElement.disabled = !this.loaded;
      this.durationElement.innerText = this.duration;
    });
    this.audio.addEventListener('timeupdate', () => {
      this.timeupdate();
    });
    this.audio.addEventListener('ended', () => {
      this.ended();
      this.setSongActive(this.singleton.getPlaying);
    });
    this.btnPlayActiveSong.addEventListener('click', this.togglePlay.bind(this));
  }

  startPlaying(time, setAction) {
    if (setAction === 'next') {
      this.load(this.singleton.getNext(this.random, this.setNext()));
    } else if (setAction === 'previous') {
      this.load(this.singleton.getPrevious(this.random, this.setPrevious()));
    }
    if (this.playingState) {
      this.play();
    }
    this.time = time;
    this.UI.render(this.songData);
    this.setSongActive(this.songSelected);
    this.UI.togglePlayBtn(this.playingState);
  }

  load(songUrl = this.singleton.getRandom(this.random)) {
    const url = `${this.pathUrl}/${songUrl.mp3}.mp3`;
    this.songData = songUrl;
    this.audio.src = url;
  }

  timer() {
    const timer = this.UI.renderTimer();
    const slider = this.UI.renderSlider();
    this.timeElement = this.UI.renderColTime();
    this.durationElement = this.UI.renderColDur();
    this.sliderElement = this.UI.renderSliderInput();
    this.sliderLabel = this.UI.renderSlideLabel();

    this.sliderElement.addEventListener('input', this.slideAction.bind(this));

    slider.appendChild(this.sliderLabel);
    slider.appendChild(this.sliderElement);
    timer.appendChild(this.timeElement);
    timer.appendChild(slider);
    timer.appendChild(this.durationElement);

    timer.addEventListener('change', this.timechanged.bind(this));

    return timer;
  }

  controls() {
    const controls = this.UI.renderControls();
    this.randomBtn = this.UI.renderRandomBtn();
    this.repeatBtn = this.UI.renderRepeatBtn(this.repeatBtn);
    this.playBtn = this.UI.renderPlayBtn();
    this.previousBtn = this.UI.renderPreviousBtn();
    this.nextBtn = this.UI.renderNextBtn();

    this.randomBtn.addEventListener('click', this.toggleRandom.bind(this));
    this.repeatBtn.addEventListener('click', this.actionRepeat.bind(this));
    this.playBtn.addEventListener('click', this.togglePlay.bind(this));
    this.previousBtn.addEventListener('click', () => {
      this.toggleBack();
    });
    this.nextBtn.addEventListener('click', () => {
      this.toggleNext();
    });

    controls.appendChild(this.randomBtn);
    controls.appendChild(this.previousBtn);
    controls.appendChild(this.playBtn);
    controls.appendChild(this.nextBtn);
    controls.appendChild(this.repeatBtn);

    return controls;
  }

  renderPlayer() {
    const player = this.UI.renderPlayer();
    const timer = this.timer();
    const controls = this.controls();

    player.appendChild(timer);
    player.appendChild(controls);
    this.contPlayer.appendChild(player);
  }

  songItemAction(song, index) {
    this.UI.cleanSongListClass();
    this.songSelected = song._id;
    this.load(this.singleton.getOne(this.songSelected));
    this.playingState = true;
    this.singleton.setPlaying = this.songSelected;
    this.playingIndex = index;
    this.startPlaying(0);
  }

  renderListSongs() {
    const contSongs = this.UI.renderContSongs();
    let dataSongs = this.singleton.getActiveList();

    this.UI.clearContSongs();

    dataSongs.forEach((song, index) => {
      const itemSong = this.UI.renderSongItem(dataSongs, song, index);
      itemSong.addEventListener('click', () => this.songItemAction(song, index));
      itemSong.appendChild(this.renderBtnFavorite(index));
      contSongs.appendChild(itemSong);
      this.contSongs.appendChild(contSongs);
      this.setSongActive();
    });
  }

  favoriteAction(song, index, btn) {
    this.UI.updateUIBtnFavorite(btn);
    this.singleton.update(song[index]._id, index)
      .then(() => {
        if (this.singleton.getViewPlayList) {
          this.renderListSongs();
        }
      })
  }

  renderBtnFavorite(index) {
    const song = this.singleton.getActiveList();
    const btnAdd = this.UI.renderUIBtnFavorite(song[index].favorite);

    btnAdd.addEventListener('click', () => this.favoriteAction(song, index, btnAdd));

    return btnAdd;
  }

  setSongActive(songSelected) {
    if (songSelected) {
      this.songSelected = songSelected;
    } else {
      this.songSelected = this.singleton.getPlaying;
    }
    this.UI.updateUIItemActive(this.songSelected);
 }

  setNext() {
    let playing = this.singleton.getPlaying;
    const songList = this.singleton.getActiveList();
    let id = null;

    if (this.playingIndex >= songList.length - 1) {
      id = songList[0]._id;
      this.playingIndex = 0;
    } else {
      songList.forEach((element, index) => {
        if (element._id === playing) {
          id = songList[index += 1]._id;
          this.playingIndex = index;
        }
      });
    }
    return id;
  }

  setPrevious() {
    let playing = this.singleton.getPlaying;
    const songList = this.singleton.getActiveList();
    let id = null;

    if (this.playingIndex <= 0) {
      id = songList[songList.length -1]._id;
      this.playingIndex = songList.length -1;
    } else {
      songList.forEach((element, index) => {
        if (element._id === playing) {
          id = songList[index -= 1]._id;
          this.playingIndex = index;
        }
      });
    }
    return id;
  }

  timechanged() {
    this.audio.timeElement = (this.sliderElement.value / 100) * this.audio.duration;
  }

  timeupdate() {
    this.time = this.audio.currentTime;
  }

  play() {
    this.audio.play();
    this.playingState = true;
  }

  pause() {
    this.audio.pause();
    this.playingState = false;
  }

  actionRepeat() {
    this.repeat = !this.repeat;
    if (this.repeat) {
      this.audio.loop = this.repeat;
    }
    this.repeatBtn.classList.toggle('player__btn-repeat--active');
  }

  toggleRandom() {
    this.random = !this.random;
    this.randomBtn.classList.toggle('player__btn-random--active');
  }

  togglePlay() {
    if (this.playingState) {
      this.pause();
    } else {
      this.play();
    }
    this.UI.togglePlayBtn(this.playingState);
  }

  toggleNext() {
    if (this.playingState) {
      this.startPlaying(0, 'next');
    } else {
      this.startPlaying(this.TIME, 'next');
    }
  }

  toggleBack() {
    if (this.playingState) {
      this.startPlaying(0, 'previous');
    } else {
      this.startPlaying(this.TIME, 'previous');
    }
  }

  slideAction() {
    this.time = (this.sliderElement.value * this.audio.duration) / 100;
    this.audio.currentTime = this.TIME;
  }

  ended() {
    if (this.repeat) {
      this.play();
    } else {
      this.startPlaying(0, 'next');
    }
  }
}
