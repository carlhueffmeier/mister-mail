declare module '@dazn/lambda-powertools-middleware-sample-logging' {
  import middy from '@middy/core';

  export interface SampleLoggingMiddlewareConfig {
    sampleRate: number;
  }
  const SampleLoggingMiddleware: middy.Middleware<SampleLoggingMiddlewareConfig>;

  export default SampleLoggingMiddleware;
}
