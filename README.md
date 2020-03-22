# <span style="margin-right:10px">👨🏻‍✈️</span> Mister Mail

Friendly mass mailer.

## Architecture

A very rough first-iteration whiteboard-architecture draft.

<a href="https://drive.google.com/file/d/12FSTrMZs5HWeGkN_7h481OHAxGHd0cRv/view?usp=sharing">
<img src="https://user-images.githubusercontent.com/27681148/77238769-bbb9aa00-6bd3-11ea-83d0-c3ec02fb49b9.png" width="640"></img>
</a>

## Setup

```bash
npm install
```

## Deploy

To deploy the application, simply run

```bash
npm run deploy
```

## Sign-up

The sign-up process is not supported in the web-client yet. Use the AWS CLI to sign up and confirm a new user identity.

```bash
aws cognito-idp sign-up \
  --client-id <CLIENT ID> \
  --username bob@gmail.com \
  --password password

aws cognito-idp admin-confirm-sign-up \
  --user-pool-id <USER POOL ID> \
  --username bob@gmail.com
```

## Troubleshooting

### Log Group already exists

This project is using custom resources to set up the SES event destination. (SNS event destinations are not supported by Cloudformation)
But the log group of the Lambda function is not cleaned up automatically. This can lead to the following error when deleting and re-creating the stack.

```
  Serverless Error ---------------------------------------

  An error occurred: ConfigureEmailEventsLogGroup - /aws/lambda/mister-mail-dev-ConfigureEmailEvents already exists.
```

The solution is easy enough.

- Go to the [Cloud Watch log groups page](https://console.aws.amazon.com/cloudwatch/home#logs:)
- Select your region
- Select the log group mentioned in the error messsage
- Click **Actions -> Delete log group**

## DynamoDB Schema

| PK      | SK   | Content                           |
| ------- | ---- | --------------------------------- |
| User Id | user | User data                         |
|         | C-1  | Campaign data for campaign (id=1) |

### Access Patterns

| Get           | By                    | Using              |
| ------------- | --------------------- | ------------------ |
| User Data     | User Id               | Query PK+SK        |
| All campaigns | User Id               | Query PK+SK prefix |
| Campaign      | User Id + Campaign Id | Query PK+SK        |
