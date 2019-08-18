
resource "aws_api_gateway_rest_api" "email_open_tracker_rest_api" {
  name        = "EmailOpenTrackerRestAPI"
  description = "Exposed Webhook for Incoming tracking events"
} # define API Gateway

resource "aws_api_gateway_resource" "email_open_tracker_proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.email_open_tracker_rest_api.id}"
  parent_id   = "${aws_api_gateway_rest_api.email_open_tracker_rest_api.root_resource_id}"
  path_part   = "{proxy+}"
} # define Proxy Resource on API Gateway

resource "aws_api_gateway_method" "email_open_tracker_proxy" {
  rest_api_id   = "${aws_api_gateway_rest_api.email_open_tracker_rest_api.id}"
  resource_id   = "${aws_api_gateway_resource.email_open_tracker_proxy.id}"
  http_method   = "ANY"
  authorization = "NONE"
} # define Http Method on API_Gateway

resource "aws_api_gateway_integration" "email_open_tracker_lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.email_open_tracker_rest_api.id}"
  resource_id = "${aws_api_gateway_method.email_open_tracker_proxy.resource_id}"
  http_method = "${aws_api_gateway_method.email_open_tracker_proxy.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.email_open_tracker_lambda.invoke_arn}"
} # define integration to allow API Gateway call the lambda function

resource "aws_api_gateway_method" "email_open_tracker_proxy_root" {
  rest_api_id   = "${aws_api_gateway_rest_api.email_open_tracker_rest_api.id}"
  resource_id   = "${aws_api_gateway_rest_api.email_open_tracker_rest_api.root_resource_id}"
  http_method   = "ANY"
  authorization = "NONE"
} # define root Http Method on "/"

resource "aws_api_gateway_integration" "email_open_tracker_lambda_root" {
  rest_api_id = "${aws_api_gateway_rest_api.email_open_tracker_rest_api.id}"
  resource_id = "${aws_api_gateway_method.email_open_tracker_proxy_root.resource_id}"
  http_method = "${aws_api_gateway_method.email_open_tracker_proxy_root.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.email_open_tracker_lambda.invoke_arn}"
} # define lambda integration on root Http Method

resource "aws_api_gateway_deployment" "email_open_tracker_deployment" {
  depends_on = [
    "aws_api_gateway_integration.email_open_tracker_lambda",
    "aws_api_gateway_integration.email_open_tracker_lambda_root",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.email_open_tracker_rest_api.id}"
  stage_name  = "test"
} # deploy API Gateway

output "webhook_url" {
  value = "${aws_api_gateway_deployment.email_open_tracker_deployment.invoke_url}"
} # Supply this URL to MailGun as the webjook
