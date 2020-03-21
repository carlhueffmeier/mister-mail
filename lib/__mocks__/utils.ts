export function getConfig(
  envKeys: Record<string, string>,
): Record<string, string> {
  return Object.values(envKeys).reduce(
    (env: Record<string, string>, name: string) => {
      env[name] = name;
      return env;
    },
    {},
  );
}
