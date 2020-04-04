function getFromEnv(key: string): string {
  const value = process.env[key];
  if (typeof value === 'undefined') {
    throw new Error(`Environment variable "${key}" not found.`);
  }
  return value;
}

export function getConfig(
  envKeys: Record<string, string>,
): Record<string, string> {
  return Object.values(envKeys).reduce(
    (env: Record<string, string>, name: string) => {
      env[name] = getFromEnv(name);
      return env;
    },
    {},
  );
}
