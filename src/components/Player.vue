<script>
import { mapActions, mapState } from "pinia";
import usePlayerStore from "../stores/player";
export default {
  name: "PlayerComponent",
  data() {
    return {
      volume: 50,
    };
  },
  computed: {
    ...mapState(usePlayerStore, [
      "playing",
      "seek",
      "duration",
      "playerProgress",
      "currentSong",
      "isLooping",
    ]),
  },
  methods: {
    ...mapActions(usePlayerStore, [
      "toggleMusic",
      "updateSeek",
      "changeVolume",
      "toggleLoop",
      "toggleLoop",
    ]),
    changeVolumeHandler(volumeLevel) {
      this.changeVolume(volumeLevel);
    },
    handleLoop() {
      this.toggleLoop();
    },
  },
};
</script>
<template>
  <div class="fixed bottom-0 left-0 bg-white px-4 py-2 w-full">
    <!-- Track Info -->
    <div class="text-center" v-if="currentSong.modified_name">
      <span class="song-title font-bold">{{ currentSong.modified_name }}</span>
      by
      <span class="song-artist">{{ currentSong.display_name }}</span>
    </div>
    <div class="flex flex-nowrap gap-4 items-center">
      <!-- Play/Pause Button -->
      <button type="button" @click.prevent="toggleMusic">
        <i
          class="fa text-gray-500 text-xl"
          :class="{ 'fa-play': !playing, 'fa-pause': playing }"
        ></i>
      </button>
      <!-- Current Position -->
      <div class="player-currenttime">{{ seek }}</div>
      <!-- Scrub Container  -->
      <div
        @click.prevent="updateSeek"
        class="w-full h-2 rounded bg-gray-200 relative cursor-pointer"
      >
        <!-- Player Ball -->
        <span
          class="absolute -top-2.5 -ml-2.5 text-gray-800 text-lg"
          :style="{ left: playerProgress }"
        >
          <i class="fas fa-circle"></i>
        </span>
        <!-- Player Progress Bar-->
        <span
          class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
          :style="{ width: playerProgress }"
        ></span>
      </div>
      <!-- Duration -->
      <div class="player-duration">{{ duration }}</div>
      <div class="slider-container">
        <div class="flex justify-center">
          <input
            @input="changeVolumeHandler(volume)"
            v-model="volume"
            type="range"
            min="0"
            max="100"
          />
          <div class="slider-value">
            <p class="ml-1">{{ volume }}</p>
          </div>
        </div>
      </div>
      <div>
        <i
          @click="handleLoop"
          :class="{ 'text-green-400': isLooping }"
          class="material-icons"
          style="font-size: 20px"
          >loop</i
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider {
  position: relative;
  width: 200px;
  height: 20px;
}
.slider-value {
  font-family: "Google Sans Regular";
  width: 28px;
  height: 20px;
  text-align: center;
}
</style>
