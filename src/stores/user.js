import { defineStore } from "pinia";
import { auth, usersCollection } from "@/includes/firebase";

export const useUserStore = defineStore("user", {
  state: () => ({
    loggedIn: false,
  }),

  actions: {
    async register(values) {
      const userCred = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      await usersCollection.doc(userCred.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });

      await userCred.user.updateProfile({
        displayName: values.name,
      });

      this.loggedIn = true;
    },
    async authenticate(values) {
      await auth.signInWithEmailAndPassword(values.email, values.password);

      this.loggedIn = true;
    },

    async signOut() {
      await auth
        .signOut()
        .then(() => {
          this.loggedIn = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
