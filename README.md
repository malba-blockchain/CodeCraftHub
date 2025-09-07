# User Management Service

## Overview
A comprehensive Node.js service for managing users with authentication and authorization for online learning platforms. This service provides secure user registration, login functionality, and role-based access control with JWT authentication.

## Features
- **User Registration**: Secure user account creation with password hashing
- **User Authentication**: JWT-based login system
- **Role-Based Access Control**: Support for student, instructor, and admin roles
- **Password Security**: bcrypt password hashing
- **Database Integration**: MongoDB with Mongoose ODM
- **Error Handling**: Winston logging with comprehensive error management
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Configuration**: Secure environment variable management

## Technologies
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcrypt for password hashing
- **Logging**: Winston for application logging
- **Testing**: Jest with coverage reporting
- **Development**: Nodemon for hot reloading
- **HTTP Client Testing**: Supertest

## Project Structure
```
src/
├── app.js                 # Main application entry point
├── config/
│   ├── db.js             # MongoDB connection configuration
│   ├── server.js         # Express server initialization
│   └── env.js            # Environment configuration
├── controllers/
│   └── userController.js # User-related request handlers
├── models/
│   └── userModel.js      # User database schema
├── routes/
│   └── userRoutes.js     # API route definitions
├── middlewares/
│   └── authMiddleware.js # JWT authentication middleware
├── services/
│   └── userService.js    # Business logic layer
└── utils/
    ├── logger.js         # Winston logger configuration
    └── errorHandler.js   # Global error handling middleware
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd user-management-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=mongodb://root:<mongo_password>@<mongo_host>:27017/usermngtservice?authSource=admin
   PORT=5000
   JWT_SECRET=your_super_secure_jwt_secret_key
   ```

4. **Generate a secure JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

## API Endpoints

### Authentication Endpoints

#### Register User
- **POST** `/api/users/register`
- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "student" // Optional: "student" | "instructor" | "admin"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "User registered successfully."
  }
  ```

#### Login User
- **POST** `/api/users/login`
- **Description**: Authenticate user and receive JWT token
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Authentication
For protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles
- **student**: Default role for regular users
- **instructor**: For content creators and course instructors  
- **admin**: Full administrative access

## Error Handling
The service includes comprehensive error handling with:
- Global error middleware
- Winston logging to files and console
- Structured error responses
- Database connection error handling

## Security Features
- Password hashing with bcrypt (salt rounds: 10)
- JWT token expiration (1 hour)
- CORS protection
- Environment variable protection
- Input validation and sanitization

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm test` | Run Jest test suite |
| `npm test -- --coverage` | Run tests with coverage report |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://user:pass@host:port/db` |
| `PORT` | Server port number | `5000` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |

## Logging
The application uses Winston for logging with:
- Console output for development
- File logging (`error.log`) for errors
- JSON format for structured logging

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing
The project uses Jest for testing. Tests should cover:
- User registration and login functionality
- Authentication middleware
- Database operations
- Error handling scenarios

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support
For support and questions, please open an issue in the repository or contact the development team.