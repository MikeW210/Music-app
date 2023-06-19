import {
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage,
  configure,
} from "vee-validate";
import { defineRule } from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  digits,
  integer,
  min_value,
  max_value,
  confirmed,
  not_one_of,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("email", email);
    defineRule("digits", digits);
    defineRule("integer", integer);
    defineRule("min_value", min_value);
    defineRule("max_value", max_value);
    defineRule("confirmed", confirmed);
    defineRule("not_one_of", not_one_of);
    defineRule("antarctica", not_one_of);
    defineRule("alpha_spaces", alphaSpaces);

    configure({
      generateMessage: (context) => {
        const messages = {
          required: `The ${context.field} is required`,
          min: `The input of ${context.field} is to short`,
          max: `The input of ${context.field} is to long`,
          email: `The ${context.field} field must contain valid email`,
          digits: `The ${context.field} field must be a digit`,
          integer: `The ${context.field} field must be integer `,
          min_value: `The ${context.field} field is to short`,
          not_one_of: `The ${context.field} can not be that`,
          antarctica: `The ${context.field} can not be in country`,
        };
        const message = messages[context?.rule?.name]
          ? messages[context?.rule?.name]
          : "The field is invalid";

        return message;
      },
    });
  },
};
