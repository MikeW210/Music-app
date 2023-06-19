import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
// import AboutView from "../views/AboutView.vue";
// import ManageView from "../views/ManageView.vue";
// import SongsComponent from "../views/SongsComponent.vue";
// import MySongs from "../views/MySongs.vue";
import { useUserStore } from "../stores/user.js";
const HomeView = () => import("@/views/HomeView.vue");
const AboutView = () => import("@/views/AboutView.vue");
const ManageView = () => import("@/views/ManageView.vue");
const SongsComponent = () => import("@/views/SongsComponent.vue");
const MySongs = () => import("@/views/MySongs.vue");
const routes = [
  {
    name: "home",
    path: "/",
    component: HomeView,
  },
  {
    name: "about",
    path: "/about",
    component: AboutView,
  },
  {
    name: "song",
    path: "/songs/:id",
    component: SongsComponent,
  },
  {
    name: "manage",
    path: "/manage-music",
    component: ManageView,
    meta: {
      requireAuth: true,
    },
  },
  // {
  //   name: "mySongs",
  //   path: "/my-songs",
  //   component: MySongs,
  //   meta: {
  //     requireAuth: true,
  //   },
  // },
  { path: "/manage", redirect: { name: "manage" } },
  { path: "/:catchAll(.*)*", redirect: { name: "home" } },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requireAuth) {
    next();
    return;
  }
  const userStore = useUserStore();
  if (to.meta.requireAuth && userStore.loggedIn) {
    next();
    return;
  } else {
    next({ name: "home" });
  }
});

export default router;
