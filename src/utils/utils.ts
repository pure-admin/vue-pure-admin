export const baseUrlApi = (url: string) =>
  process.env.NODE_ENV === "development"
    ? `${import.meta.env.VITE_BASE_URL}/${url}`
    : `${import.meta.env.VITE_APP_PRO_URL}/${url}`;
