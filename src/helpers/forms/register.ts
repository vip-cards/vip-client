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

  referredBy: Joi.string().trim(),
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
    .required()
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
  profession: Joi.array().required(),
  interests: Joi.array().required(),
  country: Joi.any().required(),
  city: Joi.any().required(),
})
  .or("email", "phone")
  .with("password", "re-password")
  .messages({
    "object.missing": t("emailOrPhoneValidation"),
    "object.with": t("rePasswordValidation"),
  });

export const registerFormData = [
  { name: "referredBy", type: "text", required: false },
  { name: "name", type: "text", required: true },

  { name: "email", type: "email", required: false },
  { name: "phone", type: "tel", required: false },
  { name: "password", type: "password", required: true },
  { name: "re-password", type: "password", required: true },

  { name: "age", type: "number", required: true, min: "10", max: "100" },
];
