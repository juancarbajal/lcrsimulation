terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

# Create new SQS Queue
resource "aws_sqs_queue" "LCRSQSqueue" {
  name = "LCRSQSqueue"
  max_message_size = 262144 
}

module "eventbridge" {
  source = "terraform-aws-modules/eventbridge/aws"

  bus_name = "LCRbus"
  attach_sqs_policy = true
  sqs_target_arns = [
    aws_sqs_queue.LCRSQSqueue.arn
  ]
  # attach_cloudwatch_policy = true
  # cloudwatch_target_arns   = [aws_cloudwatch_log_group.this.arn]
  append_rule_postfix = false

  rules = {
    cases = {
      description   = "Capture all game data"
      event_pattern = jsonencode({ "source" : ["LCRApp"] })
      enabled       = true
    }
  }

  targets = {
    cases = [
      {
        name            = "send-orders-to-sqs"
        arn             = aws_sqs_queue.LCRSQSqueue.arn
	  },
    ]
  }
  
  tags = {
    Name = "LCRbus"
  }
  attach_policy_json = true
  policy_json        = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "xray:GetSamplingStatisticSummaries"
      ],
      "Resource": ["*"]
    }
  ]
}
EOF

  attach_policy_jsons = true
  policy_jsons = [<<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "xray:*"
      ],
      "Resource": ["*"]
    }
  ]
}
EOF
  ]
  number_of_policy_jsons = 1

}


resource "aws_sqs_queue_policy" "queue" {
  queue_url = aws_sqs_queue.LCRSQSqueue.id
  policy    = data.aws_iam_policy_document.queue.json
}

data "aws_iam_policy_document" "queue" {
  statement {
    sid     = "events-policy"
    actions = ["sqs:SendMessage"]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }

    resources = [
      aws_sqs_queue.LCRSQSqueue.arn,
    ]
  }
}

# resource "eventbridge" "LCR-eventbridge" { 
# }

#DynamoDb
resource "aws_dynamodb_table" "LCRdb" {
  name             = "LCRdb"
  hash_key         = "LCRTableHashKey"
  billing_mode     = "PAY_PER_REQUEST"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "LCRTableHashKey"
    type = "S"
  }

  replica {
    region_name = "us-east-2"
  }

  replica {
    region_name = "us-west-2"
  }
}

# resource "aws_cloudwatch_log_group" "this" {
#   name = "LCRCloudWatch"

#   tags = {
#     Name = "LCRCloudwatch"
#   }
# }
