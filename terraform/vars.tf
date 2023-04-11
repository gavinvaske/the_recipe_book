variable "environment_name" {
    type = string
    description = "The current environment resources being deployed"
    validation {
        condition = anytrue([
            var.environment_name == "dev",
            var.environment_name == "prod",
        ])

        error_message = "'environment_name' must be 'dev' or 'prod'"
    }
}