import Singleton from './singleton';

export default class Player {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.contPlayer = document.querySelector('.song_cover');
    this.contCover = document.querySelector('.cover');
    this.contName = document.querySelector('.song_name_active');
    this.contArtist = document.querySelector('.song_artist');
    this.btnClose = document.querySelector('.btn-close');
    this.contSongs = document.querySelector('.songs_list');

    // active song
    this.btnShowPlayer = document.querySelector('.show-player');
    this.contActiveName = document.querySelector('.song_name');
    this.contActivePlay = document.querySelector('.play_button');

    this.SONGS_URL = 'https://sauljlm.github.io/songs-data';
    this.audio = new Audio();
    this.singleton = new Singleton();
    this.songData = null;

    // elements
    this.randomIcon = null;
    this.playIcon = null;
    this.repeatIcon = null;
    this.timeElement = null;
    this.sliderElement = null;
    this.sliderLabel = null;
    this.durationElement = null;
    this.songSelected = null;
    this.arraySelected = null;

    // values
    this.RANDOM = false;
    this.LOADED = false;
    this.PLAYING = false;
    this.REPEAT = false;
    this.TIME = 0;

    this.songUrl = this.singleton.getRandom(this.RANDOM);

    this.renderListSongs();
    this.renderPlayer();
    this.load(this.songUrl);
    this.render();
    this.setSongActive();

    // EVENTS
    this.audio.addEventListener('ended', () => {
      this.time = 0;
      this.load(this.singleton.getNext(this.RANDOM, this.setNext()));
      this.play();
      this.render();
      this.setSongActive();
    });

    this.audio.addEventListener('loadeddata', () => {
      this.loaded = true;
    });

    this.audio.addEventListener('timeupdate', () => {
      this.timeupdate();
    });
    this.btnClose.addEventListener('click', () => {
      this.contPlayer.classList.toggle('hide-player');
    });

    this.btnShowPlayer.addEventListener('click', () => {
      this.contPlayer.classList.toggle('hide-player');
    });
  }

  get loaded() {
    return this.LOADED;
  }

  set loaded(value) {
    this.LOADED = value;

    this.timeElement.innerText = this.time;
    this.sliderElement.disabled = !this.LOADED;
    this.durationElement.innerText = this.duration;
  }

  set random(value) {
    this.RANDOM = value;
    this.randomIcon.classList.toggle('random-active');
  }

  get playing() {
    return this.PLAYING;
  }

  set playing(value) {
    this.PLAYING = value;
  }

  get repeat() {
    return this.REPEAT;
  }

  set repeat(value) {
    this.REPEAT = value;
    this.audio.loop = this.REPEAT;

    // update icon
    this.repeatIcon.classList.toggle('repeat-active');
  }

  get time() {
    return Player.FormatTime(this.audio.currentTime);
  }

  set time(value) {
    this.TIME = value;

    // update
    this.sliderElement.value = (this.TIME * 100) / this.audio.duration;
    this.timeElement.innerText = this.time;
  }

  get duration() {
    return Player.FormatTime(this.audio.duration);
  }

  static FormatTime(time) {
    if (time === 0) return '00:00';
    const secs = Math.round(time);
    // let hours = Math.floor(secs / (60 * 60));

    const minutesDivisor = secs % (60 * 60);
    let minutes = Math.floor(minutesDivisor / 60);

    const secondsDivisor = minutesDivisor % 60;
    let seconds = Math.ceil(secondsDivisor);

    // hours = hours ? (hours < 10 ? `0${hours}` : hours) : '--';
    if (minutes < 10) {
      minutes = `0${minutes}`;
    } else {
      minutes = '00';
    }
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
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

  setBack() {
    let playing = this.singleton.getPlaying;
    if (playing <= 0) {
      playing = this.singleton.getSongs.length - 1;
    } else {
      playing -= 1;
    }
    return playing;
  }

  renderListSongs() {
    const container = document.createElement('ul');
    container.setAttribute('class', 'songs');

    this.composeList(container);

    this.contSongs.appendChild(container);
  }

  addSong() {
    console.log(this.songSelected); // eslint-disable-line
  }

  btnAdd(song) {
    const btnAdd = document.createElement('button');

    if (song.favorite === true) btnAdd.classList.add('add_button-active');
    btnAdd.setAttribute('class', 'add_button');
    btnAdd.setAttribute('aria-label', 'btn add to playlist');

    btnAdd.addEventListener('click', () => {
      if (song.favorite === true) {
        this.singleton.setFavorite = false;
        song.favorite = false; // eslint-disable-line
        btnAdd.classList.remove('add_button-active');
      } else {
        song.favorite = true; // eslint-disable-line
        btnAdd.classList.add('add_button-active');
      }
      this.addSong();
    });
    return btnAdd;
  }

  setSongActive(songSelected) {
    const songs = document.querySelectorAll('.song');
    if (songSelected) {
      this.songSelected = this.songSelected;
    } else {
      this.songSelected = this.singleton.getPlaying;
    }
    songs.forEach((song, index) => {
      song.classList.remove('song-active');
      if (this.songSelected === index) {
        song.classList.add('song-active');
      }
    });
  }

  composeList(container = this.contSongs) {
    const songs = this.singleton.getSongs;
    this.clear(container);

    songs.forEach((song, index) => {
      const row = document.createElement('li');
      row.setAttribute('id', `${index}`);
      row.setAttribute('dataSong', `${songs[index].dataSong}`);
      row.setAttribute('class', 'song clearfix');

      const title = document.createElement('p');
      title.innerHTML = `${song.title} - ${song.artist}`;

      row.appendChild(title);
      row.appendChild(this.btnAdd(songs[index]));

      row.addEventListener('click', () => {
        document.querySelectorAll('.song').forEach((element) => {
          element.classList.remove('song-active');
        });
        this.songSelected = index;
        this.arraySelected = 'songs';
        this.time = 0;
        this.load(this.singleton.getOne(this.songSelected));
        if (this.playing === true) this.play();
        this.render();
        this.setSongActive(this.songSelected);
      });
      container.appendChild(row);
      this.setSongActive();
    });
  }

  clear(container) { // eslint-disable-line
    container.innerHTML = ''; // eslint-disable-line
  }

  render() {
    this.contCover.setAttribute('src', `img/covers/${this.songData.cover}`);
    this.contCover.setAttribute('alt', `cover of ${this.songData.title}`);
    this.contName.innerHTML = `${this.songData.title}`;
    this.contActiveName.innerHTML = `${this.songData.title}`;
    this.contArtist.innerHTML = `${this.songData.artist}`;
    this.contActivePlay.addEventListener('click', this.togglePlay.bind(this));
  }

  renderPlayer() {
    const player = document.createElement('div');
    player.classList.add('player');

    player.appendChild(this.timer());
    player.appendChild(this.controls());

    this.contPlayer.appendChild(player);
  }

  controls() {
    const controls = document.createElement('div');
    controls.classList.add('controls');

    this.randomIcon = document.createElement('button');
    this.randomIcon.classList.add('random');
    this.randomIcon.setAttribute('aria-label', 'button-random');

    this.repeatIcon = document.createElement('button');
    this.repeatIcon.classList.add('repeat');
    this.repeatIcon.setAttribute('aria-label', 'button-repeat');

    this.playIcon = document.createElement('button');
    this.playIcon.classList.add('play');
    this.playIcon.setAttribute('aria-label', 'button-play');

    this.backIcon = document.createElement('button');
    this.backIcon.classList.add('back');
    this.backIcon.setAttribute('aria-label', 'button-back');

    this.nextIcon = document.createElement('button');
    this.nextIcon.classList.add('next');
    this.nextIcon.setAttribute('aria-label', 'button-next');

    // events
    this.randomIcon.addEventListener('click', this.toggleRandom.bind(this));
    this.repeatIcon.addEventListener('click', this.toggleRepeat.bind(this));
    this.playIcon.addEventListener('click', this.togglePlay.bind(this));
    this.backIcon.addEventListener('click', this.toggleBack.bind(this));
    this.nextIcon.addEventListener('click', this.toggleNext.bind(this));

    controls.appendChild(this.randomIcon);
    controls.appendChild(this.backIcon);
    controls.appendChild(this.playIcon);
    controls.appendChild(this.nextIcon);
    controls.appendChild(this.repeatIcon);
    return controls;
  }

  timer() {
    const row = document.createElement('div');
    row.classList.add('timer');

    const colTime = document.createElement('div');
    colTime.classList.add('time');
    this.timeElement = document.createElement('p');
    colTime.appendChild(this.timeElement);

    const colSlider = document.createElement('div');
    colSlider.classList.add('slider');
    this.sliderElement = document.createElement('input');
    this.sliderLabel = document.createElement('label');

    this.sliderLabel.innerHTML = 'slider bar';

    this.sliderLabel.setAttribute('class', 'sr-only');
    this.sliderLabel.setAttribute('for', 'slider-bar');
    this.sliderElement.setAttribute('name', 'slider-bar');
    this.sliderElement.setAttribute('id', 'slider-bar');

    this.sliderElement.type = 'range';
    this.sliderElement.disabled = true;
    this.sliderElement.min = 0;
    this.sliderElement.max = 100;
    this.sliderElement.value = 0;
    colSlider.appendChild(this.sliderLabel);
    colSlider.appendChild(this.sliderElement);

    const colDuration = document.createElement('div');
    colDuration.classList.add('duration');
    this.durationElement = document.createElement('p');
    colDuration.appendChild(this.durationElement);

    // events
    row.addEventListener('change', this.timechanged.bind(this));
    this.sliderElement.addEventListener('input', this.slideAction.bind(this));

    row.appendChild(colTime);
    row.appendChild(colSlider);
    row.appendChild(colDuration);
    return row;
  }

  slideAction() {
    this.time = (this.sliderElement.value * this.audio.duration) / 100;
    this.audio.currentTime = this.TIME;
  }

  load(songUrl) {
    if (songUrl) {
      this.songData = songUrl;
      const url = `${this.SONGS_URL}/${songUrl.mp3}.mp3`;
      this.audio.src = url;
    }
  }

  toggleRandom() {
    this.random = !this.RANDOM;
  }

  togglePlay() {
    if (this.playing) {
      this.pause();
      this.contActivePlay.classList.remove('btn-active');
      this.playIcon.classList.remove('btn-active');
    } else {
      this.play();
      this.contActivePlay.classList.add('btn-active');
      this.playIcon.classList.add('btn-active');
    }
    this.setSongActive();
  }

  toggleNext() {
    if (this.playing) {
      this.time = 0;
      this.load(this.singleton.getNext(this.RANDOM, this.setNext()));
      this.play();
      this.render();
    } else {
      this.load(this.singleton.getNext(this.RANDOM, this.setNext()));
      this.pause();
      this.render();
    }
    this.setSongActive();
  }

  toggleBack() {
    if (this.playing) {
      this.time = 0;
      this.load(this.singleton.getBack(this.RANDOM, this.setBack()));
      this.play();
      this.render();
    } else {
      this.load(this.singleton.getBack(this.RANDOM, this.setBack()));
      this.pause();
      this.render();
    }
    this.setSongActive();
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
  }

  play() {
    this.audio.play();
    this.playing = true;
  }

  pause() {
    this.audio.pause();
    this.playing = false;
  }

  timeupdate() {
    this.time = this.audio.currentTime;
  }

  timechanged() {
    this.audio.timeElement = (this.sliderElement.value / 100) * this.audio.duration;
  }

  ended() {
    if (this.repeat) {
      this.play();
    }
  }
}
