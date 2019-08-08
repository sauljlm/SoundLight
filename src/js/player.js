import Singleton from './singleton';

export default class Player {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.SONGS_URL = 'https://sauljlm.github.io/songs-data';
    this.audio = new Audio();
    this.singleton = new Singleton();

    // elements
    // this.mutedIcon = null;
    this.randomIcon = null;
    this.playIcon = null;
    this.repeatIcon = null;
    this.timeElement = null;
    this.sliderElement = null;
    this.durationElement = null;

    // values
    // this.MUTED = false;
    this.RANDOM = false;
    this.LOADED = false;
    this.PLAYING = false;
    this.REPEAT = false;
    this.TIME = 0;

    this.songUrl = this.singleton.getOne(this.RANDOM);

    this.render();
    this.load(this.songUrl);

    // EVENTS
    this.audio.addEventListener('ended', () => {
      this.time = 0;
      this.load(this.singleton.getOne(this.RANDOM, this.setNext()));
      this.play();
    });

    this.audio.addEventListener('loadeddata', () => {
      this.loaded = true;
    });

    this.audio.addEventListener('timeupdate', () => {
      this.timeupdate();
    });
  }

  get loaded() {
    return this.LOADED;
  }

  set loaded(value) {
    this.LOADED = value;

    // update the play icon
    this.playIcon.classList.toggle('active');

    this.timeElement.innerText = this.time;
    this.sliderElement.disabled = !this.LOADED;
    this.durationElement.innerText = this.duration;
  }

  set random(value) {
    this.RANDOM = value;
  }

  get playing() {
    return this.PLAYING;
  }

  set playing(value) {
    this.PLAYING = value;

    this.playIcon.classList.toggle('btn-active');
  }

  get repeat() {
    return this.REPEAT;
  }

  set repeat(value) {
    this.REPEAT = value;
    this.audio.loop = this.REPEAT;

    // update icon
    this.repeatIcon.classList.toggle('active');
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

  render() {
    const player = document.createElement('div');
    player.classList.add('col', 's12');

    player.appendChild(this.timer());
    player.appendChild(this.controls());

    this.container.appendChild(player);
  }

  controls() {
    const controls = document.createElement('div');
    controls.classList.add('controls');

    // this.mutedIcon = document.createElement('button');
    // this.mutedIcon.classList.add('mute');
    this.dandomIcon = document.createElement('button');
    this.dandomIcon.classList.add('random');

    this.repeatIcon = document.createElement('button');
    this.repeatIcon.classList.add('repeat');

    this.playIcon = document.createElement('button');
    this.playIcon.classList.add('play');

    this.backIcon = document.createElement('button');
    this.backIcon.classList.add('back');

    this.nextIcon = document.createElement('button');
    this.nextIcon.classList.add('next');

    // events
    this.dandomIcon.addEventListener('click', this.toggleRandom.bind(this));
    this.repeatIcon.addEventListener('click', this.toggleRepeat.bind(this));
    this.playIcon.addEventListener('click', this.togglePlay.bind(this));
    this.backIcon.addEventListener('click', this.toggleBack.bind(this));
    this.nextIcon.addEventListener('click', this.toggleNext.bind(this));

    controls.appendChild(this.dandomIcon);
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
    this.sliderElement.type = 'range';
    this.sliderElement.disabled = true;
    this.sliderElement.min = 0;
    this.sliderElement.max = 100;
    this.sliderElement.value = 0;
    colSlider.appendChild(this.sliderElement);

    const colDuration = document.createElement('div');
    colDuration.classList.add('duration');
    this.durationElement = document.createElement('p');
    colDuration.appendChild(this.durationElement);

    // events
    row.addEventListener('change', this.timechanged.bind(this));

    row.appendChild(colTime);
    row.appendChild(colSlider);
    row.appendChild(colDuration);
    return row;
  }

  load(songUrl) {
    if (songUrl) {
      const url = `${this.SONGS_URL}/${songUrl}.mp3`;
      this.audio.src = url;
    }
  }

  toggleRandom() {
    this.random = !this.random;
  }

  togglePlay() {
    if (this.playing) this.pause();
    else this.play();
  }

  toggleNext() {
    if (this.playing) {
      this.time = 0;
      this.load(this.singleton.getNext(this.RANDOM, this.setNext()));
      this.play();
    } else {
      this.load(this.singleton.getNext(this.RANDOM, this.setNext()));
      this.pause();
    }
  }

  toggleBack() {
    if (this.playing) {
      this.time = 0;
      this.load(this.singleton.getBack(this.RANDOM, this.setBack()));
      this.play();
    } else {
      this.load(this.singleton.getBack(this.RANDOM, this.setBack()));
      this.pause();
    }
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
