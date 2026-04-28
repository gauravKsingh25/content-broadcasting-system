# Content Broadcasting System

## Tech Stack
- Runtime: Node.js (ES Modules)
- Framework: Express.js
- Database: PostgreSQL
- Auth: JWT + bcrypt
- File Upload: Multer
- Validation: express-validator

## Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14
- npm >= 9.0.0

## Setup Instructions

### 1. Clone and install
git clone <repo-url>
cd content-broadcasting-system
npm install

### 2. Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret

### 3. Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE content_broadcasting;"

### 4. Initialize tables and start server
npm run dev
# Tables are auto-created on first run. Server starts on port 3000.

## API Endpoints

### Auth (Public)
POST /api/auth/register    - Register a new user (teacher or principal)
POST /api/auth/login       - Login and receive JWT token

### Teacher Routes (Requires JWT, role=teacher)
POST /api/content/upload   - Upload content with file (multipart/form-data)
GET  /api/content/my       - View own uploaded content and status

### Principal Routes (Requires JWT, role=principal)
GET  /api/content/all      - View all content
GET  /api/content/pending  - View pending content
PATCH /api/approval/:id/approve  - Approve content
PATCH /api/approval/:id/reject   - Reject content (body: { rejectionReason })

### Public Student API (No auth required)
GET /content/live/:teacherId           - Get currently active content for a teacher
GET /content/live/:teacherId?subject=Maths  - Filter by subject

## Request Examples

### Register
POST /api/auth/register
{ "name": "John", "email": "john@school.com", "password": "pass123", "role": "teacher" }

### Upload Content
POST /api/content/upload
Headers: Authorization: Bearer <token>
Form-data: title, subject, file (image), startTime, endTime, rotationDuration

### Get Live Content
GET /content/live/1
GET /content/live/1?subject=Maths

## Response Format
All responses follow:
{ "success": true/false, "data": {}, "message": "string" }

## Assumptions
- Teachers must set both startTime AND endTime for content to be scheduled (not just one).
- Content without startTime/endTime is never shown even if approved.
- Rotation uses wall-clock time from earliest start_time as epoch (no persistent state needed).
- File storage is local (./uploads). For production, swap multer config to use S3.