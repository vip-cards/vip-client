import { t } from "i18next";
import Joi from "joi";

export const reviewSchema = Joi.object({
  type: Joi.string().valid("product", "vendor").required(),
  client: Joi.string().required(),
  vendor: Joi.string().required(),
  product: Joi.string().required(),
  review: Joi.string()
    .required()
    .messages({
      "string.empty": t("review_notEmpty"),
    }),
  rating: Joi.number()
    .min(0)
    .max(5)
    .required()
    .messages({
      "number.min": t("review_min"),
      "number.max": t("review_max"),
      "number.base": t("review_base"),
      "any.required": t("review_required"),
    }),
});

export const reviewForm = [
  {
    name: "rating",
    type: "list",
    identifier: "name",
    list: [
      { name: { en: 1, ar: 1 } },
      { name: { en: 2, ar: 2 } },
      { name: { en: 3, ar: 3 } },
      { name: { en: 4, ar: 4 } },
      { name: { en: 5, ar: 5 } },
    ],
    required: false,
  },
  { name: "review", type: "textarea", required: false },
];
