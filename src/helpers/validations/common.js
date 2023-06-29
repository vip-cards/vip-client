import { t } from "i18next";
import Joi from "joi";

export const emailSchema = Joi.string()
  .trim()
  .email({ tlds: { allow: false } })
  .normalize()
  .lowercase();

export const passwordSchema = Joi.string()
  .trim()
  .required()
  .messages({
    "string.empty": t("passwordValidation"),
    "any.required": t("passwordValidation"),
    "string.pattern.base": t("passwordValidation"),
  });

export const phoneSchema = Joi.string()
  .trim()
  .pattern(/^\d{11}$/)
  .messages({
    "string.pattern.base": t("phoneValidation"),
  });
