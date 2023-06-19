<script>
import { mapActions, mapState } from "pinia";
import { auth, songsCollection } from "../includes/firebase";
import usePlayerStore from "../stores/player";

export default {
  name: "MySongs",
  data() {
    return {
      songs: [],
      playlist: [],
      maxNumberOfSongs: 20,
    };
  },
  async created() {
    this.getSongs();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    ...mapActions(usePlayerStore, [
      "newSong",
      "stopAndResetSong",
      "toggleMusic",
      "playPlaylist",
    ]),
    async getSongs() {
      await songsCollection
        .where("uid", "==", auth.currentUser.uid)
        .get()
        .then((querySnapshots) => {
          querySnapshots.forEach((doc) => this.addSong(doc));
        });
      this.pendingRequest = false;
    },
    addSong(doc) {
      const song = {
        ...doc.data(),
      };
      this.songs.push(song);
    },
    handlePlaylistClick(song) {
      this.currentSong.uid && song == this.currentSong
        ? this.toggleMusic()
        : this.playPlaylist(0, this.playlist);
    },
    handleClick(song) {
      this.currentSong.uid && song == this.currentSong
        ? this.toggleMusic()
        : this.newSong(song);
    },
    addSongToPlaylist(song) {
      if (this.playlist.includes(song)) {
        const index = this.playlist.indexOf(song);
        this.playlist.splice(index, 1);
      } else {
        this.playlist.push(song);
      }
    },
  },
  computed: {
    ...mapState(usePlayerStore, ["playing", "currentSong"]),
  },
};
</script>

<template>
  <div class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="relative col-span-1 bg-white rounded border border-gray-200">
        <button
          @click.prevent="handlePlaylistClick(song)"
          type="button"
          class="absolute playlist-player z-50 h-10 w-10 text-xl bg-neutral-400 text-black rounded-full mr-3 focus:outline-none"
        >
          <i
            class="fas"
            :class="{
              'fa-play': !playing,
              'fa-pause': playing,
            }"
          ></i>
        </button>
        <button
          @click.prevent="stopAndResetSong()"
          type="button"
          class="absolute playlist-stop z-50 h-10 w-10 text-xl bg-neutral-400 text-black rounded-full mr-3 focus:outline-none"
        >
          <i class="fas fa-stop"></i>
        </button>
        <div v-for="song in playlist" :key="song.id" class="px-4 py-1">
          <span class="font-bold block text-gray-700">
            {{ song.modified_name }}
          </span>
        </div>
      </div>
      <div class="bg-white rounded border border-gray-200 col-span-2">
        <ol>
          <li
            v-for="song in songs"
            :key="song.id"
            :song="song"
            class="flex p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
          >
            <div>
              <button
                @click.prevent="handleClick(song)"
                type="button"
                class="z-50 h-10 w-10 text-xl bg-white text-black rounded-full mr-3 focus:outline-none"
              >
                <i
                  class="fas"
                  :class="{
                    'fa-play': !playing,
                    'fa-pause': playing,
                  }"
                ></i>
              </button>
              <button
                @click.prevent="stopAndResetSong()"
                type="button"
                class="z-50 h-10 w-10 text-xl bg-white text-black rounded-full focus:outline-none mr-3"
              >
                <i class="fas fa-stop"></i>
              </button>
            </div>
            <div class="flex song">
              <span class="font-bold block text-gray-600">
                {{ song.modified_name }}
              </span>
              <input
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                @change="addSongToPlaylist(song)"
              />
            </div>
            <!-- <p>hehe</p> -->
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playlist-player {
  top: -20px;
  left: -20px;
}
.playlist-stop {
  right: -30px;
  top: -20px;
}
.song {
  flex: 1;
  width: auto;
  align-items: center;
  justify-content: space-between;
}
</style>
