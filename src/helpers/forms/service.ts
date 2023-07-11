import { getLocalizedWord } from "helpers/lang";
import { phoneSchema } from "helpers/validations/common";
import { t } from "i18next";
import Joi from "joi";

export const serviceSchema = Joi.object({
  client: Joi.string().required(),
  serviceName: Joi.string()
    .required()
    .messages({
      "string.empty": t("service_name_notEmpty"),
      "any.required": t("service_name_required"),
    }),
  providerName: Joi.string()
    .required()
    .messages({
      "string.empty": t("service_providerName_notEmpty"),
      "any.required": t("service_providerName_required"),
    }),

  description: Joi.string()
    .required()
    .messages({
      "string.empty": t("service_description_notEmpty"),
      "any.required": t("service_description_required"),
    }),

  address: Joi.string()
    .required()
    .messages({
      "string.empty": t("service_address_notEmpty"),
      "any.required": t("service_address_required"),
    }),

  category: Joi.array()
    .min(1)
    .required()
    .messages({
      "array.empty": t("service_category_notEmpty"),
      "any.required": t("service_category_required"),
      "array.min": t("service_category_min"),
    }),
  phone: phoneSchema.required().messages({
    "string.empty": t("service_phone_notEmpty"),
    "any.required": t("service_phone_required"),
  }),
  whatsapp: Joi.string().optional(),
  telegram: Joi.string().optional(),
});

export const serviceForm = (records) => [
  { name: "serviceName", type: "text", required: true },
  { name: "providerName", type: "text", required: true },
  { name: "description", type: "textarea", required: true },
  { name: "address", type: "text", required: true },
  {
    name: "category",
    type: "multi-select",
    required: false,
    identifier: "name",
    list: records ?? [],
    placeholder: t("select"),
  },
  { name: "phone", type: "phone", required: true },
  { name: "whatsapp", type: "phone", required: false },
  { name: "telegram", type: "phone", required: false },
];
