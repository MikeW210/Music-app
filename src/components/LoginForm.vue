<script>
import { mapActions } from "pinia";
import { useUserStore } from "../stores/user";
export default {
  name: "LoginForm",
  data() {
    return {
      login_schema: {
        email: "required|email",
        password: "required|min:9|max:50|not_one_of:password",
      },
      login_during_submission: false,
      login_submitted: false,
      login_alert_message: "Your account is being created",
      login_alert_class: "bg-blue-500",
    };
  },
  methods: {
    ...mapActions(useUserStore, ["authenticate"]),
    async loginUser(values) {
      console.log(values);
      console.log("dupa");
      this.login_during_submission = true;
      this.login_submitted = true;
      this.login_alert_message = "You are currently logging in";
      this.login_alert_class = "bg-blue-500";
      try {
        await this.authenticate(values);
      } catch {
        this.login_during_submission = true;
        this.login_submitted = false;
        this.login_alert_class = "bg-red-500";
        this.login_alert_message = "Unexpected error";
        return;
      }
      this.login_alert_class = "bg-green-500";
      this.login_alert_message = "You are logged in";
      window.location.reload();
    },
  },
};
</script>
<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="login_during_submission"
    :class="login_alert_class"
  >
    {{ login_alert_message }}
  </div>
  <vee-form :validation-schema="login_schema" @submit="loginUser">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
        rules="email"
      />
      <ErrorMessage name="email" class="text-red-600" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage name="password" class="text-red-600" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>
