import AWS from 'aws-sdk';
import { Email, EmailStatus } from './email-repository.types';
import { EmailRepository } from './email-repository';
import { SendEmailRequest } from './email-service.types';

export class EmailService {
  private ses: AWS.SES;
  private emailRepository: EmailRepository;
  private configurationSet: string;

  constructor(
    ses: AWS.SES,
    emailRepository: EmailRepository,
    configurationSet: string,
  ) {
    this.ses = ses;
    this.emailRepository = emailRepository;
    this.configurationSet = configurationSet;
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
    const result = await this.ses.sendEmail(sesRequest).promise();
    const error = result.$response?.error;
    const email: Email = {
      messageId: result.MessageId,
      status: !error ? EmailStatus.Sent : EmailStatus.Failed,
    };
    await this.emailRepository.create(email);
    return email;
  }
}
