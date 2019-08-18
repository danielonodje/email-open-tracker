provider "aws" {
  region = "us-east-2"
} # declare AWS provider

resource "aws_lambda_function" "email_open_tracker_lambda" {
  function_name = "EmailOpenTracker"

  s3_bucket = "email-open-tracker"
  s3_key    = "index.js.zip"

  handler = "index.handler"
  runtime = "nodejs8.10"

  role = "${aws_iam_role.email_open_tracker_lambda_exec.arn}"
} # define EmailOpenTracker Lambda Function

resource "aws_iam_role" "email_open_tracker_lambda_exec" {
  name = "email_open_tracker_lambda_iam"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
        "Action": "sts:AssumeRole",
        "Principal": {
            "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
        }
    ]
}
EOF
} # define IAM Role with permission to execute lambda



resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.email_open_tracker_lambda.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.email_open_tracker_deployment.execution_arn}/*/*"
} # allow api gateway to access the lambda fn


resource "aws_iam_role_policy" "email_open_tracker_dynamodb_lambda_policy" {
  name   = "EmailOpenTrackerDynamoDBLambdaFunctionPolicy"
  role   = "${aws_iam_role.email_open_tracker_lambda_exec.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem"
      ],
      "Resource": "${aws_dynamodb_table.email_open_tracker_dynamodb_table.arn}"
    }
  ]
}
EOF
} # Allow Lambda save items in DynamoDB

resource "aws_iam_role_policy" "email_open_tracker_sns_lambda_policy" {
  name   = "EmailOpenTrackerSNSLambdaFunctionPolicy"
  role   = "${aws_iam_role.email_open_tracker_lambda_exec.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sns:Publish"
      ],
      "Resource": "${aws_sns_topic.email_open_tracker_sns_topic.arn}"
    }
  ]
}
EOF
} # Allow Lambda function publish messages to SNS topic


resource "aws_iam_role_policy" "email_open_tracker_logs_lambda_policy" {
  name   = "EmailOpenTrackerCloudWatchLogStreamLambdaFunctionPolicy"
  role   = "${aws_iam_role.email_open_tracker_lambda_exec.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:PutLogEvents",
        "logs:CreateLogStream"
      ],
      "Resource": "${aws_cloudwatch_log_stream.email_open_tracker_lambda_cloudwatch_log_stream.arn}"
    }
  ]
}
EOF
} # Allow Lambda function publish messages to SNS topic
