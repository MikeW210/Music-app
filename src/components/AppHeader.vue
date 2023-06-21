<script>
import { useUserStore } from "../stores/user";
import { mapStores, mapActions, mapWritableState } from "pinia";
import useModalStore from "../stores/modal";
import i18n from "../includes/i18n";

export default {
  name: "AppHeader",
  computed: {
    ...mapStores(useModalStore),
    ...mapWritableState(useUserStore, ["loggedIn"]),
    currentLocale() {
      return this.$i18n.locale === "pl" ? "Polski" : "English";
    },
  },
  methods: {
    ...mapActions(useUserStore, ["signOut"]),
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen;
      console.log(this.modalStore.isOpen);
    },
    logOut() {
      this.signOut();
      this.loggedIn = false;
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: "home" });
      }
    },
    changeLocale() {
      return (this.$i18n.locale = this.$i18n.locale === "pl" ? "en" : "pl");
    },
  },
};
</script>
<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        exact-active-class="no-active"
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        >Music</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">{{
              $t("appHeader.about")
            }}</router-link>
          </li>
          <!-- Navigation Links -->
          <li v-if="!loggedIn">
            <a @click="toggleAuthModal" class="px-2 text-white" href="#">{{
              $t("appHeader.login")
            }}</a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">{{
                $t("appHeader.manage")
              }}</router-link>
            </li>
            <!-- <li>
              <router-link class="px-2 text-white" :to="{ name: 'mySongs' }"
                >My songs</router-link
              >
            </li> -->
            <li>
              <a class="px-2 text-white" href="#" @click="logOut">{{
                $t("appHeader.logout")
              }}</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a href="#" @click.prevent="changeLocale">{{ currentLocale }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style></style>
