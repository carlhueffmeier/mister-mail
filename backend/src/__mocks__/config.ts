enum EnvKey {
  DYNAMODB_CAMPAIGN_TABLE = 'DYNAMODB_CAMPAIGN_TABLE',
}

export const getConfig: jest.Mock<Record<EnvKey, string>> = jest.fn();
getConfig.mockImplementation(
  (): Record<EnvKey, string> =>
    Object.values(EnvKey).reduce(
      (env: Record<string, string>, name: string) => {
        env[name] = name;
        return env;
      },
      {},
    ),
);
