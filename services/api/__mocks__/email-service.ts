import AWS from 'aws-sdk';
import { EmailRepository } from '../email-repository';
import { Email, EmailStatus } from '../email-repository.types';
import { SendEmailRequest } from '../email-service.types';
import Log from '@dazn/lambda-powertools-logger';

export class EmailService {
  constructor(_args: {
    _ses: AWS.SES;
    _emailRepository: EmailRepository;
    _configurationSet: string;
    _emailTopicArn: string;
    _logger: Log;
  }) {
    // Noop
  }

  async sendEmail(_request: SendEmailRequest): Promise<Email> {
    return {
      messageId: '12345',
      status: EmailStatus.Sent,
    };
  }

  async initializeEventDestinations(): Promise<void> {
    // Noop
  }
}
