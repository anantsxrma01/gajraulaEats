provider "aws" {
  region = "us-west-2"  # Change to your desired region
}

resource "aws_s3_bucket" "local_food_delivery_bucket" {
  bucket = "local-food-delivery-platform-bucket"
  acl    = "private"

  tags = {
    Name        = "Local Food Delivery Platform Bucket"
    Environment = "Production"
  }
}

resource "aws_rds_instance" "local_food_delivery_db" {
  identifier              = "local-food-delivery-db"
  engine                 = "postgres"
  engine_version         = "13.3"  # Change to your desired version
  instance_class         = "db.t3.micro"
  allocated_storage       = 20
  storage_type           = "gp2"
  username               = "db_user"
  password               = "db_password"  # Use a secure method to manage passwords
  db_name                = "local_food_delivery"
  skip_final_snapshot    = true

  tags = {
    Name        = "Local Food Delivery Database"
    Environment = "Production"
  }
}

resource "aws_ecs_cluster" "local_food_delivery_cluster" {
  name = "local-food-delivery-cluster"
}

resource "aws_ecs_task_definition" "local_food_delivery_task" {
  family                   = "local-food-delivery-task"
  network_mode             = "bridge"
  requires_compatibilities  = ["EC2"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "api-gateway"
      image     = "your-docker-image-url/api-gateway:latest"  # Replace with your image URL
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
    },
    {
      name      = "auth-service"
      image     = "your-docker-image-url/auth-service:latest"  # Replace with your image URL
      essential = true
      portMappings = [
        {
          containerPort = 4000
          hostPort      = 4000
        }
      ]
    }
    # Add other services as needed
  ])
}

resource "aws_ecs_service" "local_food_delivery_service" {
  name            = "local-food-delivery-service"
  cluster         = aws_ecs_cluster.local_food_delivery_cluster.id
  task_definition = aws_ecs_task_definition.local_food_delivery_task.id
  desired_count   = 1

  launch_type = "EC2"

  depends_on = [
    aws_ecs_task_definition.local_food_delivery_task
  ]
}