declare module '@dazn/lambda-powertools-correlation-ids' {
  export type Context = Record<string, string>;
  export class CorrelationIds {
    constructor(context?: Context);
    clearAll(): void;
    replaceAllWith(ctx: Context): void;
    set(key: string, value: string): void;
    get(): Context;
    get debugEnabled(): boolean;
    static clearAll(): void;
    static replaceAllWith(ctx: Context): void;
    static set(key: string, value: string): void;
    static get(): Context;
  }
}
