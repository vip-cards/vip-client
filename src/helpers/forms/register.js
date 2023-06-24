import {
  emailSchema,
  passwordSchema,
  phoneSchema,
} from "helpers/validations/common";
import { t } from "i18next";
import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string()
    .messages({
      "any.required": t("nameValidation"),
      "string.empty": t("nameValidation"),
    })
    .trim()
    .required(),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  "re-password": Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .messages({
      "any.required": t("rePasswordValidation"),
      "any.only": t("rePasswordValidation"),
    }),
  age: Joi.number()
    .min(15)
    .max(100)
    .messages({
      "number.min": t("ageValidation"),
      "number.max": t("ageValidation"),
    }),
  gender: Joi.string()
    .valid("male", "female")
    .required()
    .messages({
      "any.required": t("genderValidation"),
    }),
  profession: Joi.array(),
  interests: Joi.array(),
})
  .or("email", "phone")
  .with("password", "re-password")
  .messages({
    "object.missing": t("emailOrPhoneValidation"),
    "object.with": t("rePasswordValidation"),
  });

export const registerFormData = [
  { name: "name", type: "text", required: true },
  { name: "email", type: "email", required: false },
  { name: "phone", type: "tel", required: false },
  { name: "password", type: "password", required: true },
  { name: "re-password", type: "password", required: true },
];
