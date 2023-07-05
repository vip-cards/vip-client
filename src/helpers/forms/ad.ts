export const adFormData = [
  { name: "name", type: "text", required: false },
  {
    name: "startDate",
    type: "date",
    required: true,
    dateRange: "start" as "start" | "end",
  },
  {
    name: "endDate",
    type: "date",
    required: true,
    dateRange: "start" as "start" | "end",
  },
  {
    name: "type",
    type: "list",
    list: [
      { _id: "banner", name: { en: "banner", ar: "بانر" } },
      { _id: "popup", name: { en: "popup", ar: "إعلان منبثق" } },
      { _id: "notification", name: { en: "notification", ar: "إشعار" } },
    ],
    identifier: "name",
    required: true,
  },
  { name: "notification", type: "textarea", required: false },
  {
    name: "bannerSize",
    type: "list",
    list: [
      { _id: "small", name: { en: "small", ar: "صغير" } },
      { _id: "medium", name: { en: "medium", ar: "وسط" } },
      { _id: "large", name: { en: "large", ar: "كبير" } },
    ],
    identifier: "name",
    required: true,
  },
  {
    name: "gender",
    type: "select",
    list: [{ name: "male" }, { name: "female" }, { name: "both" }],
    identifier: "name",
    required: true,
  },
  { name: "age_from", type: "number", required: false },
  { name: "age_to", type: "number", required: false },
  { name: "link", type: "text", required: false },
];
