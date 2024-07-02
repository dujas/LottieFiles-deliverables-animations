export const getEnv = (name: string, defaultValue?: string): string => {
  const value = process.env[name];

  if (value !== undefined) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Env var ${name} is not defined and a default value is not provided!`);
};
