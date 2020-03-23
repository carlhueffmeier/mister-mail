import AWS from 'aws-sdk';
import { Email, EmailStatus } from './email-repository.types';
import { EmailRepository } from './email-repository';
import { SendEmailRequest } from './email-client.types';
import Log from '@dazn/lambda-powertools-logger';

export class EmailClient {
  private ses: AWS.SES;
  private emailRepository: EmailRepository;
  private configurationSet: string;
  private logger: Log;

  constructor(args: {
    ses: AWS.SES;
    emailRepository: EmailRepository;
    configurationSet: string;
    logger: Log;
  }) {
    this.ses = args.ses;
    this.emailRepository = args.emailRepository;
    this.configurationSet = args.configurationSet;
    this.logger = args.logger;
  }

  async sendEmail(request: SendEmailRequest): Promise<Email> {
    const message: AWS.SES.Message = {
      Subject: { Data: request.subject },
      Body: {
        Text: { Data: request.text },
        Html: { Data: request.html },
      },
    };
    const sesRequest: AWS.SES.SendEmailRequest = {
      Source: request.source,
      Destination: { ToAddresses: [request.destination] },
      ConfigurationSetName: this.configurationSet,
      Message: message,
    };
    this.logger.debug('Making SES request to send email', { sesRequest });

    const result = await this.ses.sendEmail(sesRequest).promise();
    const error = result.$response?.error;
    if (error) {
      this.logger.error('Error sending email', { error });
      throw new Error(`Error sending email: ${error.message}`);
    }
    const email: Email = {
      messageId: result.MessageId,
      status: EmailStatus.Sent,
    };

    await this.emailRepository.create(email);

    return email;
  }
}
