import AWS from 'aws-sdk';
import { EmailRepository } from '../email-repository';
import { Email, EmailStatus } from '../../../lib/types';
import { SendEmailRequest } from '../send-email-use-case.types';
import Log from '@dazn/lambda-powertools-logger';

export class SendEmailUseCase {
  constructor(_args: {
    _ses: AWS.SES;
    _emailRepository: EmailRepository;
    _configurationSet: string;
    _logger: Log;
  }) {
    // Noop
  }

  async sendEmail(_request: SendEmailRequest): Promise<Email> {
    return {
      uid: 'uid',
      campaignId: 'campaignId',
      messageId: 'messageId',
      status: EmailStatus.Sent,
    };
  }

  async initializeEventDestinations(): Promise<void> {
    // Noop
  }
}
