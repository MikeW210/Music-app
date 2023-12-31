<script>
import { songsCollection, storage } from "../includes/firebase";
export default {
  name: "CompositionItem",
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    deleteSong: {
      type: Function,
      required: true,
    },
    changeUnsavedFlag: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      showForm: false,
      schema: {
        modified_name: "required",
        genre: "alpha_spaces",
      },
      inSubmission: false,
      showAlert: false,
      alertVariant: "bg-blue-500",
      alertMessage: "Please, wait! Updating song info.",
    };
  },
  methods: {
    async edit(values) {
      this.inSubmission = true;
      this.showAlert = true;
      this.alertVariant = "bg-blue-500";
      this.alertMessage = "Please wait! Updating song info";
      try {
        await songsCollection.doc(this.song.id).update(values);
      } catch (error) {
        this.inSubmission = false;
        this.alertVariant = "bg-red-500";
        this.alertMessage = "Something went wrong try again later";
        return;
      }

      this.updateSong(this.index, values);
      this.inSubmission = false;
      this.alertVariant = "bg-green-500";
      this.alertMessage = "Success!";
      this.changeUnsavedFlag(false);
    },
    async deleteSongFromDB() {
      const prompt = confirm("are you sure");
      if (prompt) {
        const storageRef = storage.ref();
        const songRef = storageRef.child(`music/${this.song.original_name}`);
        await songRef.delete();

        await songsCollection.doc(this.song.id).delete();
        this.deleteSong(this.index);
      } else {
        return;
      }
    },
  },
};
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div class="flex justify-between items-center" v-if="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <div class="flex flex-row">
        <button
          @click.prevent="deleteSongFromDB"
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        >
          <i class="fa fa-times"></i>
        </button>
        <button
          @click.prevent="showForm = !showForm"
          class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        >
          <i class="fa fa-pencil-alt"></i>
        </button>
      </div>
    </div>
    <div v-if="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="showAlert"
        :class="alertVariant"
      >
        {{ alertMessage }}
      </div>
      <vee-form
        :validation-schema="schema"
        :initial-values="song"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="changeUnsavedFlag(true)"
          />
          <ErrorMessage name="modified_name" class="text-red-600" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="changeUnsavedFlag(true)"
          />
          <ErrorMessage name="genre" class="text-red-600" />
        </div>
        <div class="flex justify-end">
          <button
            :disabled="inSubmission"
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 mr-2"
          >
            {{ $t("compositionItem.submit") }}
          </button>
          <button
            :disabled="inSubmission"
            type="button"
            class="py-1.5 px-3 rounded text-white bg-gray-600"
            @click.prevent="showForm = !showForm"
          >
            {{ $t("compositionItem.goBack") }}
          </button>
        </div>
      </vee-form>
    </div>
  </div>
</template>
