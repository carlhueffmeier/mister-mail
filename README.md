# <span style="margin-right:10px">👨🏻‍✈️</span> Mister Mail

Friendly mass mailer.

## Architecture

A very rough first-iteration whiteboard-architecture draft.

<a href="https://drive.google.com/file/d/12FSTrMZs5HWeGkN_7h481OHAxGHd0cRv/view?usp=sharing">
<img src="https://user-images.githubusercontent.com/27681148/77121976-bfff8f00-6a3c-11ea-97e4-cfd2e26b7012.png" width="640"></img>
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
