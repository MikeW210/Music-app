import { createApp } from "vue";
import { createPinia } from "pinia";
import VeeValidation from "./includes/validation";
import App from "./App.vue";
import router from "./router";
import { auth } from "./includes/firebase";
import Icon from "./directives/icon";
import "./assets/base.css";
import "./assets/main.css";
import i18n from "./includes/i18n";
import { registerSW } from "virtual:pwa-register";
import GlobalComponents from "./includes/_globals";
import progressBar from "./includes/progress-bar.js";
import "nprogress/nprogress.css";

registerSW({ immediate: true });

progressBar(router);
let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(createPinia());
    app.use(router);
    app.use(VeeValidation);
    app.use(i18n);
    app.use(GlobalComponents);
    app.mount("#app");
    app.directive("icon", Icon);
  }
});
