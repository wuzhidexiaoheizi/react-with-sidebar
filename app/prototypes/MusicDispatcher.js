/**
 * 音乐播放控制器
 */

let musicDispatcher = null;

function MusicDispatcher() {
  this.musics = [];
  this.volume = MusicDispatcher.defaults.volume;
  this.init();
}

MusicDispatcher.prototype = {
  constructor: MusicDispatcher,

  init() {
    this.render();
  },

  destroy() {
    if (this.audio) this.audio.pause();
    this.musics.length = 0;

    this.audio.parentNode.removeChild(this.audio);
    musicDispatcher = null;
  },

  render() {
    const audio = this.audio = document.createElement('audio');
    audio.style.display = 'none';
    const containment = document.querySelector('body');
    containment.appendChild(audio);
  },

  /**
   * pushMusic 压入音乐
   * @param {Object} music
   *                 src: 音频资源
   *                 loop: 是否重复播放
   *                 volume: 音量
   *                 isBgMusic: 是否背景音乐
   */
  pushMusic(music) {
    const { length } = this.musics;

    this.pause();

    if (length == 0) {
      this.musics.push(music);
    } else {
      const last = this.musics[length - 1];
      const { isBgMusic } = last;

      if (isBgMusic) {
        this.musics.push(music);
      } else {
        this.musics[length - 1] = music;
      }
    }

    this.playMusic(music);
  },

  /**
   * popMusic 压出音乐
   */
  popMusic() {
    const { length } = this.musics;

    if (length == 0) return;

    const last = this.musics[length - 1];
    const { isBgMusic } = last;

    if (!isBgMusic) {
      // this.changeVolume(0.2, 200, () => {
      //   this.pause();
      //   this.musics.pop();
      //   this.play();
      // });

      this.pause();
      this.musics.pop();
      this.play();
    }
  },

  play() {
    const music = this.musics[this.musics.length - 1];
    const { isBgMusic, isOff } = music;

    if (!isBgMusic || (isBgMusic && !isOff)) {
      this.playMusic(music);
    }
  },

  playMusic(music) {
    const { src, loop } = music;
    let { volume } = music;
    if (typeof volume == 'undefined') volume = MusicDispatcher.defaults.volume;

    this.audio.src = src;

    if (loop) {
      this.audio.loop = 'loop';
    } else {
      this.audio.removeAttribute('loop');
    }

    this.audio.currentTime = 0;
    this.audio.volume = volume;

    this.audio.play();

    // this.changeVolume(volume, 200, () => {
    //   this.audio.play();
    // });
  },

  toggle() {
    if (this.audio.paused) {
      this.resume();
    } else {
      this.pause();
    }
  },

  pause() {
    this.audio.pause();
  },

  resume() {
    this.audio.play();
  },

  /**
   * replay 从头重新播放当前音乐
   */
  replay() {
    this.pause();
    this.audio.currentTime = 0;
    this.resume();
  },

  /**
   * changeVolume 平滑地调节音量
   * @param  {Number}   destVolume 目标音量
   * @param  {Number}   time       调节时间
   * @param  {Function} callback   达到目标音量后的回调
   */
  changeVolume(destVolume, time = 200, callback) {
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

      this.resetVolume(volume);

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

  lookupBackgroundMusic() {
    return this.musics.find(music => music.isBgMusic);
  },

  /**
   * playBackgroundMusic 播放背景音乐
   */
  playBackgroundMusic() {
    const music = this.lookupBackgroundMusic();

    if (music) {
      this.playMusic(music);
      music.isOff = false;
    }
  },

  pauseBackgroundMusic() {
    const music = this.lookupBackgroundMusic();

    if (music) music.isOff = true;

    this.pause();
  },
};

MusicDispatcher.defaults = {
  volume: 1.0,
};

MusicDispatcher.getInstance = function getInstance() {
  if (!musicDispatcher) {
    musicDispatcher = new MusicDispatcher();
  }

  return musicDispatcher;
};

export default MusicDispatcher;
