declare module '@dazn/lambda-powertools-sns-client' {
  import AWS from 'aws-sdk';
  const client: AWS.SNS;
  export = client;
}
