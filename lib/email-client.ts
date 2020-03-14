import AWS from 'aws-sdk';
const ses = new AWS.SES();

export class EmailClient {
  async createTemplate(): Promise<void> {
    ses.createTemplate();
  }
}
