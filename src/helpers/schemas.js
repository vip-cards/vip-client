import Joi from "joi";

const email = Joi.string().email({ tlds: { allow: false } });
const password = Joi.string()
  .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  .required();

export const registerSchema = Joi.object({
  name_en: Joi.string().required(),
  email,
  password,
  "re-password": Joi.ref("password"),
  phone: Joi.string(),
  age: Joi.number().min(5).max(100).optional(),
  gender: Joi.string().valid("male", "female"),
})
  .or("email", "phone") // one of (email | phone) is required
  .with("password", "re-password");


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
