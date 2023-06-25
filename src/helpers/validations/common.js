import { t } from "i18next";
import Joi from "joi";

export const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .normalize();

export const passwordSchema = Joi.string()
  .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  .required()
  .messages({
    "string.empty": t("passwordValidation"),
    "any.required": t("passwordValidation"),
    "string.pattern.base": t("passwordValidation"),
  });

export const phoneSchema = Joi.string()
  .pattern(/^\d{11}$/)
  .messages({
    "string.pattern.base": t("phoneValidation"),
  });
