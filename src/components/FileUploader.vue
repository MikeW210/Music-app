<script>
import { storage, auth, songsCollection } from "../includes/firebase";
export default {
  name: "FileUploader",
  props: {
    addSong: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isDragged: false,
      uploads: [],
    };
  },
  methods: {
    upload($event) {
      this.isDragged = false;

      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];
      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          return;
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            icon: "fas fa-times",
            variant: "bg-red-400",
            text_class: "text-red-400",
          });
          return;
        }

        const storageRef = storage.ref();
        const musicRef = storageRef.child(`music/${file.name}`);
        const task = musicRef.put(file);
        const taskIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            icon: "fas fa-spinner fa-pulse",
            bgColor: "bg-blue-400",
            text_class: "",
          }) - 1;
        task.on(
          "state_changed",
          (snapshot) => {
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            this.uploads[taskIndex].current_progress = progress;
          },
          (error) => {
            this.uploads[taskIndex].text_class = "text-red-400";
            this.uploads[taskIndex].icon = "fas fa-times";
            this.uploads[taskIndex].bgColor = "bg-red-400";
            console.log(error);
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: "",
              comment_count: 0,
            };

            song.url = await task.snapshot.ref.getDownloadURL();

            const songRef = await songsCollection.add(song);
            const songSnapshot = await songRef.get();

            this.addSong(songSnapshot);

            this.uploads[taskIndex].text_class = "text-green-400";
            this.uploads[taskIndex].icon = "fas fa-check";
            this.uploads[taskIndex].bgColor = "bg-green-400";
          }
        );
      });
    },
  },
  beforeUnmount() {
    this.uploads.forEach((upload) => upload.task.cancel());
  },
};
</script>
<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': isDragged }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.stop.prevent=""
        @dragover.prevent.stop=""
        @dragenter.prevent.stop="isDragged = true"
        @dragleave.prevent.stop="isDragged = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.bgColor"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
