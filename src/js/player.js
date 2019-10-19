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
    this.arraySelected = null;

    // values
    this.random = false;
    this.playing = false;
    this.loaded = false;
    this.repeat = false;
    this.TIME = 0;
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
    });
    this.btnPlayActiveSong.addEventListener('click', this.togglePlay.bind(this));
  }

  startPlaying(time, setAction) {
    if (setAction === 'next') {
      this.load(this.singleton.getNext(this.random, this.setNext()));
    } else if (setAction === 'previous') {
      this.load(this.singleton.getPrevious(this.random, this.setPrevious()));
    }
    if (this.playing) {
      this.play();
    }
    this.time = time;
    this.UI.render(this.songData);
    this.setSongActive();
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
    this.previousBtn.addEventListener('click', this.toggleBack.bind(this));
    this.nextBtn.addEventListener('click', this.toggleNext.bind(this));

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

  renderListSongs() {
    const contSongs = this.UI.renderContSongs();
    let dataSongs = this.updateDataSongs();

    this.UI.clearContSongs();

    dataSongs.forEach((song, index) => {
      const itemSong = this.UI.renderSongsList(dataSongs, song, index);
      itemSong.addEventListener('click', () => {
        this.UI.cleanSongListClass();
        this.songSelected = index;
        this.time = 0;
        this.load(this.singleton.getOne(this.songSelected));
        this.play();
        this.UI.render(song);
        this.setSongActive(this.songSelected);
        console.log(this.playing);
        this.UI.togglePlayBtn(this.playing);
      });

      itemSong.appendChild(this.renderBtnFavorite(index));

      contSongs.appendChild(itemSong);
      this.contSongs.appendChild(contSongs);
      this.setSongActive();
    });
  }

  updateDataSongs() {
    let dataSongs = null;
    if (this.singleton.getViewPlayList) {
      dataSongs = this.singleton.getPlayList;
    } else {
      dataSongs = this.singleton.getSongs;
    }
    return dataSongs;
  }

  renderBtnFavorite(index) {
    let song = this.updateDataSongs();
    const btnAdd = this.UI.renderUIBtnFavorite(song[index].favorite);

    btnAdd.addEventListener('click', () => {
      this.UI.updateUIBtnFavorite(btnAdd);
      this.singleton.update(song[index]._id, index)
      .then(() => {
        song = this.updateDataSongs();
        this.singleton.generatePlayList();
        if (this.singleton.getViewPlayList) {
          this.renderListSongs();
        }
      });
    });

    return btnAdd;
  } 

  setSongActive(songSelected) {
    if (songSelected) {
      this.singleton.setPlaying = songSelected;
      this.songSelected = songSelected;
    } else {
      this.songSelected = this.singleton.getPlaying;
    }
    this.UI.updateUISongActive(this.songSelected);
  }

  setNext() {
    let playing = this.singleton.getPlaying;
    if (playing >= this.singleton.getSongs.length - 1) {
      playing = 0;
    } else {
      playing += 1;
    }
    return playing;
  }

  setPrevious() {
    let playing = this.singleton.getPlaying;
    if (playing <= 0) {
      playing = this.singleton.getSongs.length - 1;
    } else {
      playing -= 1;
    }
    return playing;
  }

  timechanged() {
    this.audio.timeElement = (this.sliderElement.value / 100) * this.audio.duration;
  }

  timeupdate() {
    this.time = this.audio.currentTime;
  }

  play() {
    this.audio.play();
    this.playing = true;
  }

  pause() {
    this.audio.pause();
    this.playing = false;
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
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
    this.UI.togglePlayBtn(this.playing);
    this.setSongActive();
  }

  toggleNext() {
    if (this.playing) {
      this.startPlaying(0, 'next');
    } else {
      this.startPlaying(this.TIME, 'next');
    }
    this.setSongActive();
  }

  toggleBack() {
    if (this.playing) {
      this.startPlaying(0, 'previous');
    } else {
      this.startPlaying(this.TIME, 'previous');
    }
    this.setSongActive();
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
