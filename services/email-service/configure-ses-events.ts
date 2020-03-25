import AWS from 'aws-sdk';
import {
  CloudFormationCustomResourceEvent,
  Context,
  Callback,
} from 'aws-lambda';
import https from 'https';
import url from 'url';
import 'source-map-support/register';

const handler = async (
  event: CloudFormationCustomResourceEvent,
  context: Context,
  _cb: Callback<void>,
): Promise<void> => {
  console.log('Initializing event destinations', { event });

  const ses = new AWS.SES();

  switch (event.RequestType) {
    case 'Create':
      try {
        const response = await createEventDestination();
        console.log('Successfully created event destination', { response });
        await sendResponse(event, context, 'SUCCESS');
      } catch (error) {
        console.warn('Error creating SES event destination', { error }),
          await sendResponse(event, context, 'FAILED');
      }
      break;
    case 'Update':
      await sendResponse(event, context, 'SUCCESS');
      break;
    case 'Delete':
      try {
        const response = await deleteEventDestination();
        console.log('Successfully deleted event destination', { response });
        await sendResponse(event, context, 'SUCCESS');
      } catch (error) {
        console.warn('Error deleting SES event destination', { error });
        await sendResponse(event, context, 'SUCCESS'); // Ignore the error
      }
      break;
    default:
      // This should never happen
      console.error('Unknown request type', {
        requestType: ((event as unknown) as CloudFormationCustomResourceEvent)
          .RequestType,
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function createEventDestination(): Promise<any> {
    return await ses
      .createConfigurationSetEventDestination({
        ConfigurationSetName: event.ResourceProperties.SesConfigurationSet,
        EventDestination: {
          Name: 'AllEventsSnsEventDestination',
          Enabled: true,
          MatchingEventTypes: [
            'bounce',
            'complaint',
            'delivery',
            'open',
            'reject',
            'renderingFailure',
            'send',
          ],
          SNSDestination: {
            TopicARN: event.ResourceProperties.SnsTopicArn,
          },
        },
      })
      .promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function deleteEventDestination(): Promise<any> {
    return await ses
      .deleteConfigurationSetEventDestination({
        ConfigurationSetName: event.ResourceProperties.SesConfigurationSet,
        EventDestinationName: 'AllEventsSnsEventDestination',
      })
      .promise();
  }
};

async function sendResponse(
  event: CloudFormationCustomResourceEvent,
  context: Context,
  responseStatus: 'SUCCESS' | 'FAILED',
  responseData?: object,
): Promise<void> {
  const responseBody = JSON.stringify({
    Status: responseStatus,
    Reason:
      'See the details in CloudWatch Log Stream: ' + context.logStreamName,
    PhysicalResourceId: context.logStreamName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: responseData,
  });

  console.log('RESPONSE BODY:\n', responseBody);

  const parsedUrl = url.parse(event.ResponseURL);
  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.path,
    method: 'PUT',
    headers: {
      'content-type': '',
      'content-length': responseBody.length,
    },
  };

  console.log('SENDING RESPONSE...\n');

  return new Promise((resolve, reject) => {
    const request = https.request(options, function(response) {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      resolve();
    });
    request.on('error', function(error: Error) {
      console.log('sendResponse Error:' + error);
      reject(error);
    });
    request.write(responseBody);
    request.end();
  });
}

export { handler };
