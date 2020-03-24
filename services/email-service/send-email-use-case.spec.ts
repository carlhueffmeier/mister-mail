import AWS from 'aws-sdk';
import { SendEmailUseCase } from './send-email-use-case';
import { SendEmailRequest } from './send-email-use-case.types';
import { EmailRepository } from './email-repository';
import Log from '@dazn/lambda-powertools-logger';

jest.mock('../../lib/utils');

describe('send-email-use-case', () => {
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
        const useCase = new SendEmailUseCase({
          ses: fakeSes,
          emailRepository: fakeEmailRepository,
          configurationSet,
          logger: ({ debug: jest.fn() } as unknown) as Log,
        });
        const fakeResponse = {
          async promise(): Promise<AWS.SES.SendEmailResponse> {
            return { MessageId: 'abc' } as AWS.SES.SendEmailResponse;
          },
        };
        (fakeSes.sendEmail as jest.Mock).mockReturnValueOnce(fakeResponse);

        await useCase.sendEmail(request);

        expect((fakeSes.sendEmail as jest.Mock).mock.calls).toMatchSnapshot();
      });

      it('should save the email', async () => {
        const useCase = new SendEmailUseCase({
          ses: fakeSes,
          emailRepository: fakeEmailRepository,
          configurationSet,
          logger: ({ debug: jest.fn() } as unknown) as Log,
        });
        const fakeResponse = {
          async promise(): Promise<AWS.SES.SendEmailResponse> {
            return { MessageId: 'abc' } as AWS.SES.SendEmailResponse;
          },
        };
        (fakeSes.sendEmail as jest.Mock).mockReturnValueOnce(fakeResponse);

        await useCase.sendEmail(request);

        expect(
          (fakeEmailRepository.create as jest.Mock).mock.calls,
        ).toMatchSnapshot();
      });
    });
  });
});
