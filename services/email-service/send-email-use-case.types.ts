export interface SendEmailRequest {
  uid: string;
  campaignId: string;
  subject: string;
  text: string;
  html: string;
  source: string;
  destination: string;
}
