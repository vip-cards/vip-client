export function getInitialFormData(formData) {
  const initialFormData = {};
  formData.forEach((field) => {
    initialFormData[field.name] = "";
  });
  return initialFormData;
}