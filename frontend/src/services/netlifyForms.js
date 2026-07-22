const encodeForm = (data) =>
  new URLSearchParams(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== null)
  ).toString();

export const submitNetlifyForm = async (formName, data) => {
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodeForm({
      "form-name": formName,
      "bot-field": "",
      ...data,
    }),
  });

  if (!response.ok) {
    throw new Error("Form submission failed");
  }
};
