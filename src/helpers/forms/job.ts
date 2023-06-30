import { phoneSchema } from "helpers/validations/common";
import { t } from "i18next";
import Joi from "joi";

export const jobSchema = Joi.object({
  client: Joi.string().required(),
  companyName: Joi.string()
    .required()
    .messages({
      "string.empty": t("job_companyName_notEmpty"),
      "any.required": t("job_companyName_required"),
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

  address: Joi.string()
    .required()
    .messages({
      "string.empty": t("job_address_notEmpty"),
      "any.required": t("job_address_required"),
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
  whatsapp: Joi.string().optional(),
  telegram: Joi.string().optional(),
});

export const jobForm = (categories) => [
  { name: "companyName", type: "text", required: true },
  { name: "jobTitle", type: "text", required: true },
  { name: "description", type: "textarea", required: true },
  { name: "address", type: "text", required: true },
  {
    name: "category",
    type: "multi-select",
    required: false,
    identifier: "name",
    list: categories ?? [],
  },
  { name: "phone", type: "tel", required: true },
  { name: "whatsapp", type: "tel", required: false },
  { name: "telegram", type: "tel", required: false },
];
