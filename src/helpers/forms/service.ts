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
  phone: phoneSchema,
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
    type: "checkbox",
    required: false,
    list: [...records]?.map((item) => ({
      value: item._id,
      name: getLocalizedWord(item.name),
    })),
    identifier: "name",
  },
  { name: "phone", type: "phone", required: true },
  { name: "whatsapp", type: "phone", required: false },
  { name: "telegram", type: "phone", required: false },
];
