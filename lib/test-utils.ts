import { Context, Handler } from 'aws-lambda';

export function promisifyHandler<TEvent, TResult>(
  handler: Handler<TEvent, TResult>,
) {
  return async (
    event: TEvent,
    context: Context,
  ): Promise<TResult | undefined> =>
    new Promise((resolve, reject) => {
      handler(event, context, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
}
