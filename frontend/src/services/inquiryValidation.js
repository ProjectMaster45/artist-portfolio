const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trimField = (value) => (typeof value === "string" ? value.trim() : "");

export const cleanInquiryForm = (form) => ({
  name: trimField(form.name),
  email: trimField(form.email).toLowerCase(),
  phone: trimField(form.phone),
  subject: trimField(form.subject),
  message: trimField(form.message),
  botField: trimField(form.botField),
});

export const validateInquiryForm = (form, { requireSubject = false } = {}) => {
  const data = cleanInquiryForm(form);
  const errors = {};

  if (data.botField) {
    errors.form = "We could not send your message. Please try again.";
  }

  if (data.name.length < 2) {
    errors.name = "Enter your name.";
  } else if (data.name.length > 100) {
    errors.name = "Name must be 100 characters or less.";
  }

  if (!emailPattern.test(data.email)) {
    errors.email = "Enter a valid email address.";
  } else if (data.email.length > 254) {
    errors.email = "Email must be 254 characters or less.";
  }

  if (data.phone.length > 30) {
    errors.phone = "Phone must be 30 characters or less.";
  }

  if (requireSubject && !data.subject) {
    errors.subject = "Enter a subject.";
  } else if (data.subject.length > 150) {
    errors.subject = "Subject must be 150 characters or less.";
  }

  if (data.message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (data.message.length > 3000) {
    errors.message = "Message must be 3000 characters or less.";
  }

  return { data, errors, isValid: Object.keys(errors).length === 0 };
};
