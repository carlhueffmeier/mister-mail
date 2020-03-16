import AWS from 'aws-sdk';
import { EmailService } from './email-service';
import { SendEmailRequest } from './email-service.types';
import { EmailRepository } from './email-repository';

describe('EmailService', () => {
  const fakeEmailRepository = ({
    create: jest.fn(),
  } as unknown) as EmailRepository;
  const fakeSes = ({ sendEmail: jest.fn() } as unknown) as AWS.SES;
  const configurationSet = 'configurationSet';

  describe('sendEmail', () => {
    describe('given valid request', () => {
      const request: SendEmailRequest = {
        subject: 'subject',
        text: 'text',
        html: 'html',
        source: 'source',
        destination: 'destination',
      };
      it('should send the email', async () => {
        const service = new EmailService(
          fakeSes,
          fakeEmailRepository,
          configurationSet,
        );
        const fakeResponse = {
          async promise(): Promise<AWS.SES.SendEmailResponse> {
            return { MessageId: 'abc' } as AWS.SES.SendEmailResponse;
          },
        };
        (fakeSes.sendEmail as jest.Mock).mockReturnValueOnce(fakeResponse);

        await service.sendEmail(request);

        expect((fakeSes.sendEmail as jest.Mock).mock.calls).toMatchSnapshot();
      });

      it('should save the email', async () => {
        const service = new EmailService(
          fakeSes,
          fakeEmailRepository,
          configurationSet,
        );
        const fakeResponse = {
          async promise(): Promise<AWS.SES.SendEmailResponse> {
            return { MessageId: 'abc' } as AWS.SES.SendEmailResponse;
          },
        };
        (fakeSes.sendEmail as jest.Mock).mockReturnValueOnce(fakeResponse);

        await service.sendEmail(request);

        expect(
          (fakeEmailRepository.create as jest.Mock).mock.calls,
        ).toMatchSnapshot();
      });
    });
  });
});
