import AWS from 'aws-sdk';
import nodemailer, { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/ses-transport';
import { Email, EmailStatus } from './types';
import { EmailRepository } from './email-repository';
import { SendEmailRequest } from './types';
import Log from '@dazn/lambda-powertools-logger';

export class SendEmailUseCase {
  private transporter: Transporter;
  private emailRepository: EmailRepository;
  private configurationSet: string;
  private logger: Log;

  constructor(args: {
    ses: AWS.SES;
    emailRepository: EmailRepository;
    configurationSet: string;
    logger: Log;
  }) {
    this.transporter = nodemailer.createTransport({ SES: args.ses });
    this.emailRepository = args.emailRepository;
    this.configurationSet = args.configurationSet;
    this.logger = args.logger;
  }

  async sendEmail(request: SendEmailRequest): Promise<Email> {
    const sendMailOptions: MailOptions = {
      from: request.source,
      to: request.destination,
      subject: request.subject,
      text: request.text,
      html: request.html,
      ses: {
        ConfigurationSetName: this.configurationSet,
        Tags: [
          {
            Name: 'uid',
            Value: request.uid,
          },
          {
            Name: 'campaignid',
            Value: request.campaignId,
          },
        ],
      },
    };
    this.logger.debug('Sending email', { sendMailOptions });

    const sentMessageInfo = await this.transporter.sendMail(sendMailOptions);
    this.logger.debug('Sent email', { sentMessageInfo });

    const email: Email = {
      uid: request.uid,
      campaignId: request.campaignId,
      messageId: sentMessageInfo.response,
      status: EmailStatus.Sent,
    };
    await this.emailRepository.create(email);

    return email;
  }
}
