<script>
import { useUserStore } from "../stores/user";
import { mapActions } from "pinia";
export default {
  name: "RegistrationForm",
  data() {
    return {
      schema: {
        name: "required|min:2|max:30|alpha_spaces",
        email: "required|min:3|max:50|email",
        age: "integer|min_value:18|max_value:130",
        password: "required|min:9|max:50|not_one_of:password",
        confirm_password: "confirmed:@password",
        country: "required|antarctica:Antarctica",
        tos: "required",
      },

      initialValues: {
        country: "USA",
      },
      form_during_submission: false,
      form_submitted: false,
      reg_alert_message: `${this.$t("appAuth.creatingAccount")}`,
      reg_alert_class: "bg-blue-500",
    };
  },

  methods: {
    ...mapActions(useUserStore, { createUser: "register" }),

    async register(values) {
      this.form_during_submission = true;
      try {
        await this.createUser(values);
      } catch (error) {
        this.form_during_submission = true;
        this.reg_alert_class = "bg-red-500";
        this.reg_alert_message = `${this.$t("appAuth.error")}`;
        return;
      }

      this.reg_alert_message = `${this.$t("appAuth.accountCreated")}`;
      this.reg_alert_class = "bg-green-500";
      this.form_submitted = true;
      window.location.reload();
    },
  },
};
</script>

<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="form_during_submission"
    :class="reg_alert_class"
  >
    {{ reg_alert_message }}
  </div>
  <vee-form
    :validation-schema="schema"
    @submit="register"
    :initial-values="initialValues"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("appAuth.email") }}</label>
      <vee-field
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="`${$t('appAuth.enter')} ${$t('appAuth.name')}`"
        rules="required"
      />
      <ErrorMessage name="name" class="text-red-600" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("appAuth.email") }}</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="`${$t('appAuth.enter')} ${$t('appAuth.email')}`"
        rules="email"
      />
      <ErrorMessage name="email" class="text-red-600" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("appAuth.age") }}</label>
      <vee-field
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        rules="age"
      />
      <ErrorMessage name="age" class="text-red-600" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("appAuth.password") }}</label>
      <vee-field :bails="false" name="password" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="`${$t('appAuth.enter')} ${$t('appAuth.password')}`"
          rules="password"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{
        $t("appAuth.confirmPassword")
      }}</label>
      <vee-field
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('appAuth.confirmPassword')"
        rules="confirm_password"
      />
      <ErrorMessage name="confirm_password" class="text-red-600" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("appAuth.country") }}</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <ErrorMessage name="country" class="text-red-600" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        name="tos"
        type="checkbox"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <i18n-t class="inline-block" keypath="register.accept" tag="label">
      </i18n-t>
      <a href="#">{{ $t("register.tos") }}</a>
      <ErrorMessage name="tos" class="text-red-600 block" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="form_during_submission"
    >
      {{ $t("appAuth.submit") }}
    </button>
  </vee-form>
</template>
