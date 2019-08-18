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

## Architecture

This app is a lambda function. It sits behind AWS API Gateway and it gets called when the configured endpoint receives a requests on the MailGun webhook.
it pushed the received event into DynamoDb and onto the SNS queue.

## Development

To make this work we need some environment variables:

`HMAC_SEED - A seed for the Hmac sha256 digest`

`DYNAMO_DB_TABLE_NAME - the name of the AWS DynamoDB table`

`SNS_TOPIC_ARN - the arn for the SNS topic`

`AWS_ACCESS_KEY_ID - the AWS access id`

`AWS_SECRET_ACCESS_KEY - the aws secret key`

The AWS details need to belong to a user with the permission to write to DynamoDB for the given table name and the ability to pubish to an SNS topic for the given TopicArn.

the app will not start if these environment variables are not supplied.

## Deployment

To package it for deployment, run `npm run build`. This causes webpack to generate a zip file `index.js.zip` in the dist directory. This zip file will be deployed to the AWS lambda.

The terraform config expects that the bundle zip in in s3 so we'll push it there by running `npm run push-bundle-to-s3`. This uses the aws cli tool to copy the zip bundle to s3. aws-cli must be installed and configure with a user with the required permissions.

next we deploy by running `terraform init` and `terraform apply`. This will stand up the AWS environment based on the various terraform configs available in the repo.

When the build is complete terrafrom will print the webhook url to the console.
