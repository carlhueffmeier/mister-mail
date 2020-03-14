# <span style="margin-right:10px">👨🏻‍✈️</span> Mister Mail

Friendly mass mailer.

## Architecture

More or less how the first iteration will look like.

<a href="https://drive.google.com/file/d/12FSTrMZs5HWeGkN_7h481OHAxGHd0cRv/view?usp=sharing">
<img src="https://drive.google.com/uc?id=138IUPNBW1qQiVg3A7H-KXqKreirysQYI" width="640"></img>
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
