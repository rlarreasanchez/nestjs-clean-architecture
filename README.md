<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# NestJS Application with Clean Architecture

This project is a **NestJS** application structured using **Clean Architecture** principles. The architecture ensures scalability, maintainability, and clear separation of concerns.

## Getting Started

Follow these steps to set up and run the application:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install Dependencies

Make sure you have Node.js and npm (or yarn) installed on your system. Then, install the required dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Copy the .env.example file to create a .env file:

```bash
cp .env.example .env
```

Open the .env file and set the required environment variables. These variables are necessary for the application to run properly. Ensure all variables are correctly set before deployment.

### 4. Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### 5. Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### 6. Deployment

Ensure the following before deploying the application:

All environment variables are properly set in the .env file.
The database is set up and accessible from the deployment environment.
Deploy the application using your preferred deployment strategy (e.g., Docker, cloud services, etc.).

## Project Structure

The application follows a Clean Architecture structure with the following key layers:

- Domain: Core business logic and rules.
- Application: Use cases and application logic.
- Infrastructure: External integrations like databases, APIs, etc.
- Presentation: API controllers and input/output handling.

## License

This project is licensed under the [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Contact

For questions or feedback, please contact [rlarreasanchez@gmail.com](mailto:rlarreasanchez@gmail.com).
