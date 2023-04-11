terraform {
    backend "s3" {
        bucket = "the-label-factory-eli-tf-state"
        key = "tf-infra/terraform.tfstate"
        region = "us-east-2"
    }
}

provider "aws" {
    region = "us-east-2"
}

resource "aws_s3_bucket" "the-label-factory-file-uploads" {
    bucket = "the-label-factory-file-uploads-${var.environment_name}"
    lifecycle {
        prevent_destroy = true
    }
}

resource "aws_s3_bucket_public_access_block" "file-uploads-public-access-block" {
  bucket = aws_s3_bucket.the-label-factory-file-uploads.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "allow-public-access" {
  bucket = aws_s3_bucket.the-label-factory-file-uploads.id
  policy = data.aws_iam_policy_document.allow-public-access.json
}

data "aws_iam_policy_document" "allow-public-access" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.the-label-factory-file-uploads.arn}/*"
    ]
  }
}