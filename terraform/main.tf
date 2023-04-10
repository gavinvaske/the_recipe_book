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
}