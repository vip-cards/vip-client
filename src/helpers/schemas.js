import Joi from "joi";

export const registerSchema = Joi.object({
  name_en: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
  "re-password": Joi.any().valid(Joi.ref("password")).required(),
  phone: Joi.string().optional(),
  age: Joi.number().min(5).max(100).optional(),
  gender: Joi.string().valid("male", "female"),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
});

export const createJobSchema = Joi.object({
  client: Joi.string().required(),
  companyName: Joi.object({
    en: Joi.string().required(),
  }),
  jobTitle: Joi.object({
    en: Joi.string().required(),
  }),
  description: Joi.object({
    en: Joi.string().required(),
  }),
  address: Joi.object({
    en: Joi.string().required(),
  }),
  contacts: Joi.object({
    phone: Joi.string()
      .pattern(/^[0-9]{11}$/)
      .optional(),
    whatsapp: Joi.string()
      .pattern(/^[0-9]{11}$/)
      .optional(),
    telegram: Joi.string()
      .pattern(/^[0-9]{11}$/)
      .optional(),
  }),
});
