declare module '@dazn/lambda-powertools-middleware-correlation-ids' {
  import middy from '@middy/core';

  export interface CorrelationIdsMiddlewareConfig {
    sampleDebugLogRate: number;
  }
  const CorrelationIdsMiddleware: middy.Middleware<CorrelationIdsMiddlewareConfig>;

  export default CorrelationIdsMiddleware;
}
