import { passwordSchema } from "helpers/validations/common";
import { t } from "i18next";
import Joi from "joi";

const email = Joi.string()
  .email({ tlds: { allow: false } })
  .normalize();
const password = passwordSchema;

export const loginSchema = Joi.object({
  emailOrPhone: Joi.alternatives()
    .try(email, Joi.string().pattern(/^\d{11}$/))
    .required()
    .label(t("emailOrPhone"))
    .messages({
      "alternatives.match": t("emailOrPhoneValidation"),
    }),
  password,
});

export const loginFormData = [
  { name: "emailOrPhone", type: "text", required: true },
  { name: "password", type: "password", required: true },
];
