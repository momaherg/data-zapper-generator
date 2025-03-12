
const getServerUrl = (): string => {
  // Default to localhost during development
  return "http://localhost:5000";
};

export { getServerUrl };

