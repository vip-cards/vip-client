import { t } from "i18next";
import Joi from "joi";

const email = Joi.string().email({ tlds: { allow: false } });
const password = Joi.string()
  .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  .required()
  .messages({
    "string.pattern.base": t("passwordValidation"),
  });

export const loginSchema = Joi.object({
  // make a field that is either email or phone
  emailOrPhone: Joi.alternatives()
    .try(email, Joi.string().pattern(/^\d{11}$/))
    .required()
    .label(t("emailOrPhone"))
    .messages({
      // integrate the next line with i18next
      "alternatives.match": t("emailOrPhoneValidation"),
    }),
  password,
});

export const loginFormData = [
  { name: "emailOrPhone", type: "text", required: true },
  { name: "password", type: "password", required: true },
];
