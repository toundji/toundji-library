#  Library

## Description

Library is the web service for a library application. Designed in nestjs and typeorm, it includes basic book and user management functionalities.

## Installation

Clone the repository:

```bash
git clone https://github.com/toundji/toundji-library.git
cd toundji-library
```

Install dependencies:

```bash
npm install
```


## Configuration

Create a `.env` file by copying the contents of `.env.example`:

```bash
cp .env.example .env
```
Fill in the `.env` file with the appropriate values, replacing `****` with your specific configuration.


## Execution

- Development: `npm run start`
- Watch mode:`npm run start:dev`
- Production: `npm run start:prod`



## API Documentation (Swagger)

This project includes Swagger API documentation for easy reference.


### Accessing Swagger Documentation
- Ensure your application is running locally. If it's configured to run under port 3000, set the `PORT` variable in your `.env` file to `3000`.

- Open your web browser and navigate to the following URL:


```bash
http://localhost:3000/docs
```

Adjust the URL based on your configured port if it differs from `3000`.

This URL assumes your application is hosted locally. Modify the hostname (`localhost`) and port number as needed for different environments.

- You should now see the Swagger UI interface displaying detailed documentation about your API endpoints, request parameters, and response formats.

### Example
If your application is running locally under port 3000, visit:

```bash
http://localhost:3000/docs
```
This link will provide you with an interactive Swagger interface to explore and test your API endpoints.

### Notes
. Ensure your application is actively running (`npm run start or equivalent`) before accessing the Swagger documentation.
. Adjust the URL (`localhost` and `3000`) in the example to match your specific environment configuration.
. Swagger provides a user-friendly interface for API documentation and testing, making it easier to understand and utilize your API endpoints.

