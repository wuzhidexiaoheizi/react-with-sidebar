import Constants from '../constants';

function BackgroundSounds(playOnInit) {
  this.playOnInit = playOnInit;
  this.readyState = {};
  this.currentAudio = null;
  this.setOff(!playOnInit);
  this.handlerMap = {};
  this.init();
}

BackgroundSounds.prototype = {
  constructor: BackgroundSounds,

  init() {
    const { BACKGROUND_MUSICS } = Constants;
    this.musics = [...BACKGROUND_MUSICS];
    this.createAudios();
    this.musicOptions = this.getAllOptions();
  },

  destroy() {
    this.audios.forEach(audio => {
      const src = audio.src;
      const handlerEntry = this.handlerMap[src];

      Object.keys(handlerEntry).forEach((evtName) => {
        const handler = handlerEntry[evtName];
        audio.removeEventListener(evtName, handler, false);
      });

      audio.parentNode.removeChild(audio);
    });

    this.audios.length = 0;
    this.musics.length = 0;
    this.musicOptions.length = 0;
    this.handlerMap = null;
    this.readyState = null;
  },

  getAllOptions() {
    return [...this.musics];
  },

  getOptions() {
    if (!this.musicOptions.length) this.musicOptions = this.getAllOptions();

    return this.musicOptions;
  },

  createAudios() {
    this.audios = [];
    this.musics.forEach((music) => this.audios.push(this.createAudio(music)));
  },

  createAudio(music) {
    const audio = document.createElement('audio');
    const containment = document.querySelector('body');
    containment.appendChild(audio);
    audio.src = music;
    audio.load();

    const audioLoadedCallback = () => {
      this.remarkAsReadyed(music);

      if (this.checkAllReadyed() && this.playOnInit) {
        this.randomPlay();
      }
    };

    audio.addEventListener('canplaythrough', audioLoadedCallback, false);

    const audioPlayEndedCallback = () => { this.randomPlay(); };

    audio.addEventListener('ended', audioPlayEndedCallback, false);

    this.handlerMap[music] = {
      'canplaythrough': audioLoadedCallback,
      'ended': audioPlayEndedCallback,
    };

    return audio;
  },

  remarkAsReadyed(music) {
    this.readyState[music] = true;
  },

  getReadyFlag(music) {
    return this.readyState[music];
  },

  checkAllReadyed() {
    let flag = true;

    this.musics.forEach(music => flag = flag || this.getReadyFlag(music));

    return flag;
  },

  randomPlay() {
    const musics = this.getOptions();
    const length = musics.length;
    const index = Math.floor(Math.random() * length);
    const music = musics.splice(index, 1)[0];

    this.toggleAudioState(music);
  },

  toggleAudioState(music) {
    this.audios.forEach((audio) => {
      if (audio.src == music) {
        audio.play();
        this.currentAudio = audio;
      } else {
        audio.pause();
      }
    });
  },

  pause() {
    if (this.currentAudio) this.currentAudio.pause();
  },

  play() {
    if (this.currentAudio) {
      this.currentAudio.play();
    } else {
      this.randomPlay();
    }
  },

  getName() {
    return 'background';
  },

  setOff(state) {
    this.offsetState = state;
  },

  isOff() {
    return this.offsetState;
  },
};

let instance = null;

BackgroundSounds.getInstance = function getInstance(playOnInit) {
  if (!instance) {
    instance = new BackgroundSounds(playOnInit);
  }

  return instance;
};

export default BackgroundSounds;
