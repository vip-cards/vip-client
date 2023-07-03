import { phoneSchema } from "helpers/validations/common";
import { t } from "i18next";
import Joi from "joi";

export const postSchema = Joi.object({
  client: Joi.string().required(),
  name: Joi.string()
    .required()
    .messages({
      "string.empty": t("name_notEmpty"),
      "any.required": t("name_required"),
    }),
  jobTitle: Joi.string()
    .required()
    .messages({
      "string.empty": t("job_jobTitle_notEmpty"),
      "any.required": t("job_jobTitle_required"),
    }),
  description: Joi.string()
    .required()
    .messages({
      "string.empty": t("job_description_notEmpty"),
      "any.required": t("job_description_required"),
    }),
  category: Joi.array()
    .min(1)
    .required()
    .messages({
      "array.empty": t("job_category_notEmpty"),
      "any.required": t("job_category_required"),
      "array.min": t("job_category_min"),
    }),
  phone: phoneSchema.required().messages({
    "string.empty": t("job_phone_notEmpty"),
    "any.required": t("job_phone_required"),
  }),
  cvLink: Joi.string()
    .required()
    .messages({
      "string.empty": t("job_cvLink_notEmpty"),
      "any.required": t("job_cvLink_required"),
    }),
});

export const postForm = (categories) => [
  { name: "name", type: "text", required: true },
  { name: "jobTitle", type: "text", required: true },
  { name: "description", type: "textarea", required: true },
  {
    name: "category",
    type: "multi-select",
    identifier: "name",
    required: false,
    list: categories ?? [],
  },
  { name: "phone", type: "phone", required: true, className: "phone-input" },
  { name: "cvLink", type: "text", required: true },
];
