resource "aws_cloudwatch_log_group" "email_open_tracker_lambda_cloudwatch_log_group" {
  name = "EmailOpenTrackerLambdaLogGroup"

  tags = {
    Environment = "production"
    Application = "email-open-tracker"
  }
}


resource "aws_cloudwatch_log_stream" "email_open_tracker_lambda_cloudwatch_log_stream" {
  name           = "EmailOpenTrackerLambdaLogStream"
  log_group_name = "${aws_cloudwatch_log_group.email_open_tracker_lambda_cloudwatch_log_group.name}"
}
