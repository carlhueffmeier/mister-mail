import { Context, CloudFormationCustomResourceCreateEvent } from 'aws-lambda';
import { handler } from './configure-ses-events';
import { promisifyHandler } from '../../lib/test-utils';
import https from 'https';
import http from 'http';

const fakeCreateConfigurationSetEventDestination = jest.fn();
jest.mock('aws-sdk', () => ({
  SES: jest.fn(() => ({
    createConfigurationSetEventDestination: fakeCreateConfigurationSetEventDestination,
  })),
}));
jest.mock('https');

describe('configure-email-events', () => {
  describe('given event type "Create"', () => {
    const event: CloudFormationCustomResourceCreateEvent = {
      RequestType: 'Create',
      ServiceToken: 'ServiceToken',
      ResponseURL: 'http://response-url.com/',
      StackId: 'StackId',
      RequestId: 'RequestId',
      LogicalResourceId: 'LogicalResourceId',
      ResourceType: 'ResourceType',
      ResourceProperties: {
        ServiceToken: 'ServiceToken',
        SesConfigurationSet: 'ConfigurationSet',
        SnsTopicArn: 'SnsTopicArn',
      },
    };

    it('should not throw an error', done => {
      const context: Context = {} as Context;
      const fakeRequest = ({
        on: jest.fn(),
        write: jest.fn(),
        end: jest.fn(),
      } as unknown) as http.ClientRequest;

      expect.assertions(1);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      (https.request as jest.MockedFunction<any>).mockImplementationOnce(
        (options: object, callback: (...args: any[]) => void): any => {
          setTimeout(() => callback({ statusCode: 200 }), 0);
          expect(options).toMatchSnapshot();
          done();
          return fakeRequest;
        },
      );
      /* eslint-enable @typescript-eslint/no-explicit-any */
      fakeCreateConfigurationSetEventDestination.mockReturnValueOnce({
        promise: jest.fn().mockResolvedValueOnce('ok'),
      });

      promisifyHandler(handler)(event, context);
    });
  });
});
