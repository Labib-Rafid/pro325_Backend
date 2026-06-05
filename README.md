# Project:325_Backend
University Venue Management System [SWE 0612-3130]


## Base URL

```http
http://localhost:{port}
```

---

# Authentication APIs

## Register Representative

### Endpoint

```http
POST /auth/register
```

### Request Body

```json
{
    "name": "Labib",
    "email": "labib@gmail.com",
    "password": "123456",
    "registration_number": "2021331055",
    "organization_id": 1
}
```

### Success Response

```json
{
    "message": "User Registered Successfully!"
}
```

### Error Response

```json
{
    "message": "Email Or Registration Number Already Registered!"
}
```

---

## Login

### Endpoint

```http
POST /auth/login
```

### Request Body

```json
{
    "email": "labib@gmail.com",
    "password": "123456"
}
```

### Success Response

```json
{
    "message": "Log-In Successful",
    "token": "JWT_TOKEN",
    "user": {
        "id": 1,
        "name": "Labib",
        "email": "labib@gmail.com",
        "organization_id": 1,
        "registration_number": "2021331055"
    }
}
```

---

# Admin APIs

## Get Pending Representatives

### Endpoint

```http
GET /admin/pending
```

### Headers

```http
Authorization: Bearer JWT_TOKEN
```

### Success Response

```json
[
    {
        "id": 2,
        "name": "Labib",
        "email": "labib@gmail.com",
        "registration_number": "2021331055",
        "organization_name": "SUST CSE Society"
    }
]
```

---

## Approve Representative

### Endpoint

```http
PUT /admin/approve/:id
```

### Success Response

```json
{
    "message": "User approved successfully"
}
```

---

## Reject Representative

### Endpoint

```http
PUT /admin/reject/:id
```

### Success Response

```json
{
    "message": "User rejected successfully"
}
```

---

## Get Pending Venue Creation Requests

### Endpoint

```http
GET /admin/venue-requests
```

### Success Response

```json
[
    {
        "id": 1,
        "venue_name": "Mini Auditorium",
        "capacity": 200,
        "location": "Academic Building"
    }
]
```

---

## Approve Venue Creation Request

### Endpoint

```http
PUT /admin/venue-requests/:id/approve
```

### Success Response

```json
{
    "message": "Venue request approved"
}
```

---

## Reject Venue Creation Request

### Endpoint

```http
PUT /admin/venue-requests/:id/reject
```

### Success Response

```json
{
    "message": "Venue request rejected"
}
```

---

## Get All Booking Requests

### Endpoint

```http
GET /admin/booking-requests
```

### Success Response

```json
[
    {
        "id": 1,
        "event_name": "Programming Contest",
        "venue_name": "Mini Auditorium",
        "status": "pending"
    }
]
```

---

## Approve Booking Request

### Endpoint

```http
PUT /admin/booking-requests/:id/approve
```

### Success Response

```json
{
    "message": "Booking approved"
}
```

---

## Reject Booking Request

### Endpoint

```http
PUT /admin/booking-requests/:id/reject
```

### Success Response

```json
{
    "message": "Booking rejected"
}
```

---

# Venue APIs

## Create Venue

### Endpoint

```http
POST /venues
```

### Request Body

```json
{
    "name": "Mini Auditorium",
    "capacity": 200,
    "location": "Academic Building"
}
```

### Success Response

```json
{
    "message": "Venue created successfully"
}
```

---

## Get All Venues

### Endpoint

```http
GET /venues
```

### Success Response

```json
[
    {
        "id": 1,
        "name": "Mini Auditorium",
        "capacity": 200,
        "location": "Academic Building",
        "status": "active"
    }
]
```

---

## Update Venue

### Endpoint

```http
PUT /venues/:id
```

### Request Body

```json
{
    "name": "Updated Auditorium",
    "capacity": 300,
    "location": "Academic Building"
}
```

### Success Response

```json
{
    "message": "Venue updated successfully"
}
```

---

## Delete Venue

### Endpoint

```http
DELETE /venues/:id
```

### Success Response

```json
{
    "message": "Venue deleted successfully"
}
```

---

# Venue Booking APIs

## Create Booking Request

### Endpoint

```http
POST /request/booking
```

### Request Body

```json
{
    "venue_id": 1,
    "event_name": "Programming Contest",
    "purpose": "ICPC Training Session",
    "event_date": "2026-06-15",
    "start_time": "10:00:00",
    "end_time": "12:00:00"
}
```

### Success Response

```json
{
    "message": "Request submitted successfully"
}
```

---

# Venue Creation Request APIs

## Request New Venue

### Endpoint

```http
POST /request/new-venue
```

### Request Body

```json
{
    "venue_name": "Seminar Room 205",
    "capacity": 120,
    "location": "Academic Building",
    "reason": "Workshop and seminar events"
}
```

### Success Response

```json
{
    "message": "Venue creation request submitted"
}
```

---

# Authorization

All protected routes require:

```http
Authorization: Bearer JWT_TOKEN
```

---

# Tech Stack

## Backend

* Node.js
* Express.js

## Database

* MySQL

## Authentication

* JWT (JSON Web Token)
* bcryptjs

## Additional Libraries

* cors
* dotenv

---

# User Flow

```text
Representative Registration
            ↓
Admin Approval
            ↓
Representative Login
            ↓
View Available Venues
            ↓
Create Venue Booking Request
            ↓
Admin Approval
            ↓
Venue Reserved Successfully
```

### Alternative Flow

```text
Venue Not Found
        ↓
Request New Venue
        ↓
Admin Approves Venue
        ↓
Venue Added To System
        ↓
Representative Creates Booking Request
```
