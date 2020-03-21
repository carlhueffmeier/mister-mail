import { getConfig } from '../../lib/utils';

export enum EnvKey {
  DYNAMODB_CAMPAIGN_TABLE = 'DYNAMODB_CAMPAIGN_TABLE',
  SNS_CAMPAIGNS_TOPIC_ARN = 'SNS_CAMPAIGNS_TOPIC_ARN',
  SNS_EMAIL_EVENTS_TOPIC_ARN = 'SNS_EMAIL_EVENTS_TOPIC_ARN',
  SES_CONFIGURATION_SET = 'SES_CONFIGURATION_SET',
}

export const config = getConfig(EnvKey) as Record<EnvKey, string>;
