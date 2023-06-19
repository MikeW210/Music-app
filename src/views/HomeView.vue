<script>
import { songsCollection } from "../includes/firebase";
import SongItem from "../components/SongItem.vue";
export default {
  name: "HomeComponent",
  data() {
    return {
      songs: [],
      maxNumberOfSongs: 10,
      pendingRequest: false,
    };
  },
  components: { SongItem },
  async created() {
    this.getSongs();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomWindow) {
        console.log("bottom");
        this.getSongs();
      }
    },
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }
      console.log("hehe");
      this.pendingRequest = true;
      let snapshots;
      if (this.songs.length) {
        const lastSong = await songsCollection
          .doc(this.songs[this.songs.length - 1].docId)
          .get();
        snapshots = await songsCollection
          .orderBy("modified_name")
          .startAfter(lastSong)
          .limit(this.maxNumberOfSongs)
          .get();
      } else {
        snapshots = await songsCollection
          .orderBy("modified_name")
          .limit(this.maxNumberOfSongs)
          .get();
      }

      snapshots.forEach((document) => {
        this.songs.push({
          docId: document.id,
          ...document.data(),
        });
      });
      this.pendingRequest = false;
    },
  },
};
</script>
<template>
  <!-- Introduction -->
  <section class="mb-8 py-20 text-white text-center relative">
    <div
      class="absolute inset-0 w-full h-full bg-contain introduction-bg"
      style="background-image: url(assets/img/header.png)"
    ></div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">{{ $t("homeView.listen") }}</h1>
      </div>
    </div>

    <img
      class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
      src="/assets/img/introduction-music.png"
    />
  </section>

  <!-- Main Content -->
  <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div
        class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
        v-icon="'headphones - alt'"
      >
        <span class="card-title">Songs</span>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <SongItem
          v-for="song in songs"
          :key="song.docId"
          :song="song"
        ></SongItem>
      </ol>
      <!-- .. end Playlist -->
    </div>
  </section>
</template>
