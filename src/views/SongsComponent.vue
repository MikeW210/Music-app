<script>
import {
  songsCollection,
  auth,
  commentsCollection,
} from "../includes/firebase";

import { mapState, mapActions } from "pinia";
import usePlayerStore from "../stores/player";
import { useUserStore } from "../stores/user";
import CommentComponent from "../components/CommentComponent.vue";

export default {
  name: "SongComponent",
  data() {
    return {
      song: {},
      schema: {
        comment: "required|min:3",
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_message: "Please wait. Your comment is being uploaded!",
      comments: [],
      sortOption: 1,
    };
  },
  async beforeRouteEnter(
    to,
    from,
    next // ...
  ) {
    const songSnapshot = await songsCollection.doc(to.params.id).get();

    next((vm) => {
      if (!songSnapshot.exists) {
        vm.$router.push({ name: "home" });
        return;
      }
      const { sort } = vm.$route.query;
      vm.sortOption = sort === "1" || sort === "2" ? sort : "1";
      vm.song = songSnapshot.data();
      vm.getComments();
    });
  },
  computed: {
    ...mapState(useUserStore, ["loggedIn"]),
    ...mapState(usePlayerStore, ["playing", "currentSong"]),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        console.log(this.sortOption);
        if (this.sortOption === "1") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
    },
  },
  methods: {
    ...mapActions(usePlayerStore, [
      "newSong",
      "stopAndResetSong",
      "toggleMusic",
    ]),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;

      const comment = {
        content: values.comment,
        createdAt: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };
      await commentsCollection
        .add(comment)
        .then((res) => {
          console.log(res);
          this.comment_alert_message = "Comment submitted";
          this.comment_alert_variant = "bg-green-500";
        })
        .catch((error) => {
          console.log(error);
        });
      const songSnapshot = await songsCollection.doc(this.$route.params.id);

      songSnapshot.update({
        comment_count: this.comments.length + 1,
      });
      this.getComments();
      this.comment_in_submission = false;

      resetForm();
    },

    async getComments() {
      const commentsSnapshots = await commentsCollection
        .where("sid", "==", this.$route.params.id)
        .get();
      this.comments = [];
      commentsSnapshots.forEach((commentSnapshot) =>
        this.comments.push({
          docId: commentSnapshot.id,
          ...commentSnapshot.data(),
        })
      );
    },
    handleClick(song) {
      this.currentSong.uid && song == this.currentSong
        ? this.toggleMusic()
        : this.newSong(song);
    },
  },
  watch: {
    sortOption(newVal) {
      console.log("sort watcher");
      if (newVal === this.$route.query.sort) {
        return;
      }
      console.log("sort watcher");
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
  components: { CommentComponent },
};
</script>
<template>
  <div>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="handleClick(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full mr-3 focus:outline-none"
        >
          <i
            class="fas"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          ></i>
        </button>
        <button
          @click.prevent="stopAndResetSong()"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i class="fas fa-stop"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <span>{{ $n(1, "currency", "pl") }}</span>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section v-if="loggedIn" id="comments" class="container mx-auto mt-6">
      <div
        class="text-center text-white font-bold p-4 mb-4"
        v-if="comment_show_alert"
        :class="comment_alert_variant"
      >
        {{ comment_alert_message }}
      </div>
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{
            $tc("songComponent.commentsCount", comments.length, {
              number: comments.length,
            })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <vee-form :validation-schema="schema" @submit="addComment">
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage name="comment" class="text-red-600" />
            <button
              :disabled="comment_in_submission"
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sortOption"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        v-for="comment in sortedComments"
        :key="comment.docId"
        class="p-6 bg-gray-50 border border-gray-200"
      >
        <!-- Comment Author -->
        <CommentComponent :comment="comment" />
      </li>
    </ul>
  </div>
</template>

<style></style>
