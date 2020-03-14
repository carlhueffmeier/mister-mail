enum EnvKey {
  DYNAMODB_CAMPAIGN_TABLE = 'DYNAMODB_CAMPAIGN_TABLE',
}

function getFromEnv(key: string): string {
  const value = process.env[key];
  if (typeof value === 'undefined') {
    throw new Error(`Environment variable "${key}" not found.`);
  }
  return value;
}

export function getConfig(): Record<EnvKey, string> {
  return Object.values(EnvKey).reduce(
    (env: Record<string, string>, name: string) => {
      env[name] = getFromEnv(name);
      return env;
    },
    {},
  );
}
