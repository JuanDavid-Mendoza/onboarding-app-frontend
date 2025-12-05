terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "onboarding-app-frontend-tf-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "onboarding-app-terraform-locks"
    encrypt        = true
  }
}
  
provider "aws" {
  region = var.aws_region
}

# Provider adicional para us-east-1 (necesario para certificados ACM con CloudFront)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
