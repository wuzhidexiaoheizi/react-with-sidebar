/**
 * 音乐播放控制器
 */
import Sound from './Sound';

let musicDispatcher = null;

function MusicDispatcher() {
  this.soundMap = {};
  this.currentSound = null;
  this.lastSoundName = null;
}

MusicDispatcher.prototype = {
  constructor: MusicDispatcher,

  destroy() {
    Object.values(this.soundMap).forEach((sound) => {
      sound.destroy();
    });
  },

  pushSound(music, callback) {
    const { name } = music;
    let sound = this.soundMap[name];

    this.resetLastSoundName();

    if (sound) {
      sound.play(callback);
    } else {
      sound = new Sound(music, callback);
      this.soundMap[name] = sound;
    }

    this.currentSound = sound;
  },

  popSound() {
    this.currentSound.pause();
    const lastSound = this.getLastSound(this.lastSoundName);

    if (lastSound) lastSound.play();
  },

  playBackgroundSound() {
    const bgSound = this.loopupBackgroundSound();

    this.resetLastSoundName();

    if (bgSound) {
      bgSound.setOff(false);
      bgSound.play();
      this.currentSound = bgSound;
    }
  },

  pauseBackgroundSound() {
    const bgSound = this.loopupBackgroundSound();

    if (bgSound) {
      bgSound.setOff(true);
      bgSound.pause();
    }
  },

  resetLastSoundName() {
    if (this.currentSound) {
      this.currentSound.pause();
      this.lastSoundName = this.currentSound.getName();
    }
  },

  loopupBackgroundSound() {
    const sounds = Object.values(this.soundMap);

    return sounds.find(sound => sound.isBgSound);
  },

  getLastSound(soundName) {
    return this.soundMap[soundName];
  },
};

MusicDispatcher.getInstance = function getInstance() {
  if (!musicDispatcher) {
    musicDispatcher = new MusicDispatcher();
  }

  return musicDispatcher;
};

export default MusicDispatcher;
