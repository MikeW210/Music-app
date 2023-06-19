<script>
import AppHeader from "./components/AppHeader.vue";
import AppAuth from "./components/AppAuth.vue";
import { mapWritableState } from "pinia";
import { useUserStore } from "./stores/user";
import { auth } from "./includes/firebase";
import Player from "./components/Player.vue";
export default {
  name: "App",
  components: { AppHeader, AppAuth, Player },
  computed: {
    ...mapWritableState(useUserStore, ["loggedIn"]),
  },
  created() {
    console.log(auth.currentUser);
    console.log("current user");
    if (auth.currentUser) {
      this.loggedIn = true;
    }
  },
};
</script>
<template>
  <!-- Header -->
  <app-header />
  <router-view></router-view>
  <!-- Player -->
  <Player></Player>
  <!-- Auth Modal -->
  <app-auth />
</template>
