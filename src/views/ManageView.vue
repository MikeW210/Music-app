<script>
import FileUploader from "../components/FileUploader.vue";
import { songsCollection, auth } from "../includes/firebase";
import CompositionItem from "../components/CompositionItem.vue";
export default {
  name: "ManageView",
  data() {
    return {
      songs: [],
      unsavedChanges: false,
    };
  },
  components: { FileUploader, CompositionItem },
  async created() {
    await songsCollection
      .where("uid", "==", auth.currentUser.uid)
      .get()
      .then((querySnapshots) => {
        querySnapshots.forEach((doc) => this.addSong(doc));
      });
  },
  methods: {
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    },
    deleteSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(doc) {
      const song = {
        ...doc.data(),
        id: doc.id,
      };
      this.songs.push(song);
    },
    changeUnsavedFlag(value) {
      this.unsavedChanges = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedChanges) {
      next();
    } else {
      const decision = confirm("Unsaved changes. U wanna leave?");
      next(decision);
    }
  },
};
</script>
<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <file-uploader :addSong="addSong"></file-uploader>
      </div>
      <div class="col-span-2">
        <div
          class="bg-white rounded border border-gray-200 relative flex flex-col"
        >
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i
              class="fa fa-compact-disc float-right text-green-400 text-2xl"
            ></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item
              v-for="(song, i) in songs"
              :key="song.id"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :deleteSong="deleteSong"
              :changeUnsavedFlag="changeUnsavedFlag"
            ></composition-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style></style>
