export default class Player {
  constructor(selector, songUrl = null) {
    this.container = document.querySelector(selector);
    this.SONGS_URL = 'https://sauljlm.github.io/songs-data';
    this.audio = new Audio();

    // elements
    this.mutedIcon = null;
    this.playIcon = null;
    this.repeatIcon = null;
    this.timeElement = null;
    this.sliderElement = null;
    this.durationElement = null;

    // values
    this.LOADED = false;
    this.MUTED = false;
    this.PLAYING = false;
    this.REPEAT = false;
    this.TIME = 0;

    this.render();
    this.load(songUrl);

    // EVENTS
    // play the loaded audio until the first fram is loaded
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

  get muted() {
    return this.audio.muted;
  }

  set muted(value) {
    this.MUTED = value;
    this.audio.muted = this.MUTED;

    // update the muted icon
    this.mutedIcon.classList.toggle('active');
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

    // update the slider time
    this.sliderElement.value = (this.TIME * 100) / this.audio.duration;

    // updated the current duration
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
    console.log(`${minutes}:${seconds}`);
    return `${minutes}:${seconds}`;
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

    this.mutedIcon = document.createElement('button');
    this.mutedIcon.classList.add('mute');

    this.playIcon = document.createElement('button');
    this.playIcon.classList.add('play');

    this.repeatIcon = document.createElement('button');
    this.repeatIcon.classList.add('repeat');

    // events
    this.mutedIcon.addEventListener('click', this.toggleMute.bind(this));
    this.playIcon.addEventListener('click', this.togglePlay.bind(this));
    this.repeatIcon.addEventListener('click', this.toggleRepeat.bind(this));

    controls.appendChild(this.mutedIcon);
    controls.appendChild(this.playIcon);
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

  load(songUrl = null) {
    if (songUrl) {
      this.songUrl = `${this.SONGS_URL}/${songUrl}.mp3`;
      this.audio.src = this.songUrl;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
  }

  togglePlay() {
    if (this.playing) this.pause();
    else this.play();
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
    if (this.repeat) this.play();
  }
}
