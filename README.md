# Clinic Appointment API

A simple API for managing clinic appointments built with FastAPI and Docker.

## How to Run

1. Make sure Docker is installed and running.
2. From the project folder, run:

```bash
docker compose up
```

3. Open Swagger UI at http://localhost:8000/docs

## API Endpoints

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| GET | / | No |
| POST | /login | No |
| GET | /me | Yes |
| GET | /appointments | Yes |
| GET | /appointments/{id} | Yes |
| POST | /appointments | Yes |
| PUT | /appointments/{id} | Yes |
| DELETE | /appointments/{id} | Yes |

## Authentication

This API uses Bearer token authentication to protect appointment endpoints.

### Test Account
- Username: admin
- Password: clinic123
- Token: clinic-secret-token

### Login Endpoint
Send a POST request to `/login` with the username and password to receive the access token.

### Protected Endpoints
The following endpoints require a valid Bearer token in the Authorization header.

### Educational Limitation
This authentication method is for instructional purposes only. It uses a hardcoded token with no expiration, no password hashing, and no database-backed users. A production system must use JWT tokens, secure password hashing, HTTPS, and proper access control.