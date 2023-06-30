import { Howl } from "howler";
import { defineStore } from "pinia";
import helper from "../includes/helper";

export default defineStore("player", {
  state: () => ({
    currentSong: {},
    sound: {},
    seek: "0:00",
    duration: "0:00",
    playerProgress: "0%",
    isLooping: false,
  }),
  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }
      this.currentSong = song;

      this.sound = new Howl({
        src: [song.url],
        html5: true,
        loop: this.isLooping,
      });

      this.sound.play();

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      });
    },
    changeVolume(soundLevel) {
      this.sound.volume(soundLevel / 100);
    },
    toggleLoop() {
      this.sound.loop(!this.sound.loop());
      this.isLooping = !this.isLooping;
    },
    async toggleMusic() {
      if (!this.sound.playing) {
        return;
      }
      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
    async playPlaylist(index, playlist) {
      console.log("playlist", playlist);
      const sound = new Howl({
        src: [playlist[index].url],
        preload: true,
        onend: function () {
          if (index + 1 == playlist.length) {
            this.playPlaylist(0, playlist);
          } else {
            this.playPlaylist(index + 1, playlist);
          }
        },
      });
      this.currentSong = sound;
      sound.play();
    },
    async stopAndResetSong() {
      if (this.sound instanceof Howl) {
        this.sound.stop();
      }
    },
    progress() {
      this.duration = helper.formattedTime(this.sound.duration());
      this.seek = helper.formattedTime(this.sound.seek());
      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;
      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
    updateSeek(event) {
      if (!this.sound.playing) {
        return;
      }
      console.log();
      const { x, width } = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);
      this.sound.once("seek", this.progress);
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
  },
});
