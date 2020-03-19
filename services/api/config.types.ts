// This is a little bit too obscure 💩
// Newly expose environment keys need to be added here
export enum EnvKey {
  DYNAMODB_CAMPAIGN_TABLE = 'DYNAMODB_CAMPAIGN_TABLE',
  SNS_CAMPAIGNS_TOPIC = 'SNS_CAMPAIGNS_TOPIC',
  SES_CONFIGURATION_SET = 'SES_CONFIGURATION_SET',
  SES_EMAIL_EVENTS_TOPIC_ARN = 'SES_EMAIL_EVENTS_TOPIC_ARN',
}
