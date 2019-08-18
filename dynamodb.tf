resource "aws_dynamodb_table" "email_open_tracker_dynamodb_table" {
  name           = "EmailOpenTracker"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "MessageId"

  attribute {
    name = "MessageId"
    type = "S"
  }
}
