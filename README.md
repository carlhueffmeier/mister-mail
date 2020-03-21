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
