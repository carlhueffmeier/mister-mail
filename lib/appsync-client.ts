/* eslint-disable */
import Log from '@dazn/lambda-powertools-logger';
import AWS from 'aws-sdk';
import axios from 'axios';
import { URL } from 'url';

export class AppSyncClient {
  private appSyncEndpoint: string;
  private logger: Log;

  constructor(options: { appSyncEndpoint: string; logger: Log }) {
    this.appSyncEndpoint = options.appSyncEndpoint;
    this.logger = options.logger;
  }

  async request(body: object): Promise<object> {
    const url = new URL(this.appSyncEndpoint);
    const region = url.hostname.split('.')[2];
    // @ts-ignore
    const req = new AWS.HttpRequest(this.appSyncEndpoint, region);
    req.method = 'POST';
    req.headers.host = url.hostname;
    req.headers['Content-Type'] = 'application/json';
    req.body = JSON.stringify(body);
    // @ts-ignore
    const signer = new AWS.Signers.V4(req, 'appsync', true);
    // @ts-ignore
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

    const response = await axios({
      method: 'post',
      url: this.appSyncEndpoint,
      data: req.body,
      headers: req.headers,
    });
    this.logger.debug('AppSync request', {
      body: req.body,
      status: response.status,
    });
    return response.data;
  }
}
