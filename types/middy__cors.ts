declare module '@middy/cors' {
  import middy from '@middy/core';

  interface CorsOptions {
    origin: string;
    headers: string;
    credentials: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cors: middy.Middleware<CorsOptions, any, any>;

  export default cors;
}
