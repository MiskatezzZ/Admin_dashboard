# API Routes Documentation

This directory contains API endpoints for the Ask Your Councillor admin dashboard. The backend friend can implement the actual database logic and business rules here.

## Structure

```
api/
├── forms/          # Form submissions management
├── exams/          # Exam notifications
├── users/          # User/student management  
├── mentorship/     # Mentorship sessions (TODO)
├── materials/      # Study materials (TODO)
├── blogs/          # Blog management (TODO)
├── auth/           # Authentication (TODO)
└── upload/         # File uploads (TODO)
```

## Implemented Endpoints

### Forms API (`/api/forms`)
- `GET /api/forms` - Get all form submissions with optional filtering
- `POST /api/forms` - Create new form submission
- `PUT /api/forms/[id]` - Update form submission status

### Exams API (`/api/exams`)  
- `GET /api/exams` - Get all exam notifications
- `POST /api/exams` - Create new exam notification
- `DELETE /api/exams/[id]` - Delete exam notification

### Users API (`/api/users`)
- `GET /api/users` - Get all students with pagination and filtering
- `POST /api/users` - Create new student enrollment  
- `PUT /api/users/[id]` - Update student information

## Response Format

All API responses follow this consistent format:

```json
{
  "success": true,
  "data": [...],
  "message": "Success message",
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error info"
}
```

## TODO for Backend Friend

### Database Integration
- [ ] Set up database connection (PostgreSQL/MongoDB/etc.)
- [ ] Create database schemas/models
- [ ] Implement proper error handling
- [ ] Add input validation with Zod or similar

### Authentication & Security
- [ ] Implement JWT authentication
- [ ] Add role-based access control
- [ ] Rate limiting
- [ ] CORS configuration

### File Upload
- [ ] PDF file upload endpoint (`/api/upload`)
- [ ] File storage (AWS S3/Cloudinary)
- [ ] File validation and processing

### Email Integration
- [ ] Welcome emails for new students
- [ ] Exam notification emails
- [ ] Form submission confirmations

### Additional Endpoints Needed
- [ ] `/api/mentorship` - Session management
- [ ] `/api/materials` - Study materials CRUD
- [ ] `/api/blogs` - Blog post management
- [ ] `/api/dashboard` - Dashboard statistics
- [ ] `/api/notifications` - Real-time notifications

## Frontend Integration

The UI components are already prepared to consume these APIs. Update the dummy data imports with actual API calls:

```javascript
// Instead of:
import { formSubmissions } from '@/lib/dummy-data'

// Use:
const response = await fetch('/api/forms')
const { data: formSubmissions } = await response.json()
```

## Environment Variables

Create `.env.local` file with:
```
DATABASE_URL="your-database-connection"
JWT_SECRET="your-jwt-secret"
AWS_S3_BUCKET="your-s3-bucket"
SMTP_HOST="your-email-service"
```

## Testing

Add API tests in `__tests__/api/` directory using Jest or Vitest.
