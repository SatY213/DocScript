export const escapeRegex = (text) => {
  if (!text || typeof text !== "string") return "";
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
