function Sound(music, callback) {
  this.music = music;
  const { isBgSound } = music;
  this.loadedCallback = callback;

  if (isBgSound) this.setOff(false);
  this.loaded = false;
  this.init();
}

Sound.prototype = {
  init() {
    this.render();
    this.attachEvent();
    this.initAudioState();
  },

  destroy() {
    this.detachEvent();
    this.audio.parentNode.removeClass(this.audio);
  },

  render() {
    const audio = this.audio = document.createElement('audio');
    audio.style.display = 'none';
    const containment = document.querySelector('body');
    containment.appendChild(audio);
  },

  attachEvent() {
    this.canplaythroughCallback = this.musicLoadedCallback.bind(this);

    this.audio.addEventListener('canplaythrough', this.canplaythroughCallback, false);
  },

  detachEvent() {
    this.audio.removeEventListener('canplaythrough', this.canplaythroughCallback, false);
  },

  musicLoadedCallback() {
    this.loaded = true;
    this.audio.play();
    if (typeof this.loadedCallback == 'function') {
      this.loadedCallback();
      this.loadedCallback = undefined;
    }
  },

  initAudioState() {
    const { src, loop } = this.music;

    if (loop) this.audio.loop = 'loop';

    this.audio.src = src;
    this.audio.load();
  },

  play(callback) {
    const isBgSound = this.isBgSound();

    if (!isBgSound || (isBgSound && !this.isOff())) this.audio.play();

    if (typeof callback == 'function') callback();
  },

  pause() {
    this.audio.pause();

    if (!this.isBgSound()) this.audio.currentTime = 0;
  },

  setOff(state) {
    this.offsetState = state;
  },

  isOff() {
    return this.offsetState;
  },

  getName() {
    return this.music.name;
  },

  isBgSound() {
    return this.music.isBgSound;
  },

  /**
   * changeVolume 平滑地调节音量
   * @param  {Number}   destVolume 目标音量
   * @param  {Function} callback   达到目标音量后的回调
   */
  changeVolume(destVolume, callback) {
    const time = 200;
    if (this.volume == destVolume) {
      if (typeof callback == 'function') callback();
      return;
    }

    const during = 100;
    const step = (destVolume - this.volume) / (time / during);
    let currentTime = 0;
    let volume;

    this.interval = setInterval(() => {
      currentTime += during;
      volume = this.volume + step;

      this.resetvolume(volume);

      if (currentTime < time) {
        this.resetVolume(volume);
      } else {
        clearInterval(this.interval);
        this.interval = null;
        if (typeof callback == 'function') callback();
      }
    }, during);
  },

  /**
   * resetVolume 调整音量
   * @param {Number} volume 音量
   */
  resetVolume(volume) {
    let vol = volume;

    if (vol > 1) vol = 1;
    if (vol < 0) vol = 0;

    this.volume = vol;
    this.audio.volume = vol;
  },
};

Sound.defaults = {
  volumn: 0.8,
};

export default Sound;
