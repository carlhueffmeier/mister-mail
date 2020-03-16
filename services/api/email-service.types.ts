export interface SendEmailRequest {
  subject: string;
  text: string;
  html: string;
  source: string;
  destination: string;
}
