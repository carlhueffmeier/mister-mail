declare module '@dazn/lambda-powertools-middleware-log-timeout' {
  import middy from '@middy/core';

  export interface LogTimeoutMiddlewareConfig {
    sampleDebugLogRate: number;
  }
  const LogTimeoutMiddleware: middy.Middleware<LogTimeoutMiddlewareConfig>;

  export default LogTimeoutMiddleware;
}
