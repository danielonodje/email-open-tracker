# email-open-tracker

Track Opened Mailgun Emails

We'd like to track opened mailgun emails. We aim to do this by exposing a webhook to MailGun. This webhook will be called with a POST payload similar to the example below.

```
{
  “signature”:
  {
    "timestamp": "1529006854",
    "token": "a8ce0edb2dd8301dee6c2405235584e45aa91d1e9f979f3de0",
    "signature": "d2271d12299f6592d9d44cd9d250f0704e4674c30d79d07c47a66f95ce71cf55"
  }
  “event-data”:
  {
    "event": "opened",
    "timestamp": 1529006854.329574,
    "id": "DACSsAdVSeGpLid7TN03WA",
  }
}
```

## Development

On receving the payload we'll persist the event in the by (DynamoDB) and publish the event onto Amazon Simple Notification System (SNS).

To make this work we need some environment variables:

`HMAC_SEED - A seed for the Hmac sha256 digest`

`DYNAMO_DB_TABLE_NAME - the name of the AWS DynamoDB table`

`SNS_TOPIC_ARN - the arn for the SNS topic`

`AWS_ACCESS_KEY_ID - the AWS access id`

`AWS_SECRET_ACCESS_KEY - the aws secret key`

Using [require-environment-variables](https://www.npmjs.com/package/require-environment-variables) the app will not start if these environment variables are not supplied.

## Deployment

The app is intended to be run as a lambda function. To package it for deployment, run `npm run build`. This causes webpack to generate a zip file `index.js.zip` in the dist directory. This zip file will be deployed to the AWS lambda.
