# Product Management System

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Setup and Installation](#setup-and-installation)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Contributing](#contributing)
9. [License](#license)

## Introduction
This Product Management System is a web-based application that allows users to manage products and categories. It provides functionality for creating, reading, updating, and deleting both products and categories.

## Features
- Product management (CRUD operations)
- Category management (CRUD operations)
- Pagination for product listing
- Search functionality for products
- Responsive web interface

## Technologies Used
- Java 
- Spring Boot
- Spring Data JPA
- Hibernate
- RESTful API
- HTML/CSS/JavaScript
- Maven (assumed for dependency management)

## Project Structure
The project follows a standard Spring Boot application structure:
product.management/
├── controller/
│   ├── CategoryController.java
│   └── ProductController.java
├── entity/
│   ├── CategoryEntity.java
│   └── ProductEntity.java
├── model/
│   ├── CategoryModel.java
│   └── ProductModel.java
├── repository/
│   ├── CategoryRepository.java
│   └── ProductRepository.java
├── service/
│   ├── CategoryService.java
│   └── ProductService.java
├── ManagementApplication.java
└── ServletInitializer.java
## Setup and Installation
1. Ensure you have Java JDK 11 or later installed
2. Clone the repository: `git clone https://github.com/Oswald-OSEI/ProductManagement/new/master`
3. Navigate to the project directory
4. Build the project: `mvn clean install`
5. Run the application: `java -jar target/management-0.0.1-SNAPSHOT.jar`

## Usage
After starting the application, you can access the web interface by navigating to `http://localhost:8080` in your web browser. From there, you can:

- View all products and categories
- Add new products and categories
- Edit existing products and categories
- Delete products and categories

## API Endpoints

### Products
- GET `/api/products`: Fetch all products (paginated)
- GET `/api/products/{id}`: Fetch a specific product
- POST `/api/products/add`: Create a new product
- PUT `/api/products/edit`: Update an existing product
- DELETE `/api/products/deleteProduct/{id}`: Delete a product

### Categories
- GET `/api/categories`: Fetch all categories
- GET `/api/categories/{id}`: Fetch a specific category
- POST `/api/categories/add`: Create a new category
- POST `/api/categories/edit`: Update an existing category
- DELETE `/api/categories/deleteCategory/{id}`: Delete a category

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
[Specify your license here]

