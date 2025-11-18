# Bug Tracker - MERN Application with Testing & Debugging

A comprehensive Bug Tracker application built with the MERN stack (MongoDB, Express.js, React, Node.js) that demonstrates best practices in testing and debugging.

## 🚀 Features

- **Bug Management**: Create, read, update, and delete bugs
- **Filtering & Search**: Filter bugs by status and priority
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error boundaries and validation
- **Comprehensive Testing**: Unit, integration, and end-to-end tests

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Validation** with express-validator
- **Testing**: Jest, Supertest, MongoDB Memory Server

### Frontend
- **React** with React Router
- **Axios** for API calls
- **CSS** for styling
- **Testing**: Jest, React Testing Library, Cypress

## 📁 Project Structure

```
mern-bug-tracker/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── tests/         # Frontend tests
│   │   │   ├── unit/      # Unit tests
│   │   │   └── integration/ # Integration tests
│   │   └── cypress/       # E2E tests
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── middleware/    # Custom middleware
│   ├── tests/             # Backend tests
│   │   ├── unit/          # Unit tests
│   │   └── integration/   # Integration tests
│   └── package.json
├── jest.config.js          # Jest configuration
└── package.json           # Root package.json
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-bug-tracker
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bug-tracker
   ```

4. **Set up test database** (optional, for testing)
   ```bash
   cd server
   npm run setup-test-db
   ```

### Running the Application

1. **Start both frontend and backend**
   ```bash
   npm run dev
   ```

2. **Or run separately:**
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Run backend tests only
cd server && npm test

# Run frontend tests only
cd client && npm test
```

### Test Coverage

The application includes comprehensive test coverage:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and component interactions
- **End-to-End Tests**: Test complete user workflows with Cypress

### Test Structure

#### Backend Tests
- **Unit Tests**: Validation utilities, helper functions
- **Integration Tests**: API endpoints with database operations

#### Frontend Tests
- **Unit Tests**: React components in isolation
- **Integration Tests**: Component interactions with APIs
- **E2E Tests**: Complete user journeys

## 🔧 Debugging Techniques

### Backend Debugging
- **Console Logging**: Strategic logging in controllers and middleware
- **Error Handling**: Global error handler with detailed development logs
- **Database Debugging**: Mongoose query logging

### Frontend Debugging
- **React Error Boundaries**: Catch and display component errors gracefully
- **Browser DevTools**: Network, console, and component inspection
- **React DevTools**: Component tree and state inspection

### Common Debugging Scenarios
1. **API Errors**: Check network tab and server logs
2. **Component Crashes**: Check error boundaries and console
3. **Database Issues**: Verify connection and query logs
4. **Test Failures**: Use Jest debug mode and verbose output

## 📊 API Documentation

### Bugs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bugs` | Get all bugs (with optional filtering) |
| GET | `/api/bugs/:id` | Get single bug by ID |
| POST | `/api/bugs` | Create new bug |
| PUT | `/api/bugs/:id` | Update existing bug |
| DELETE | `/api/bugs/:id` | Delete bug |

### Query Parameters (GET /api/bugs)
- `status`: Filter by status (open, in-progress, resolved, closed)
- `priority`: Filter by priority (low, medium, high, critical)
- `page`: Page number for pagination
- `limit`: Number of results per page

### Bug Object Structure
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "status": "open|in-progress|resolved|closed",
  "priority": "low|medium|high|critical",
  "reporter": "string",
  "assignee": "string (optional)",
  "tags": ["string"],
  "createdAt": "date",
  "updatedAt": "date"
}
```

## 🚀 Deployment

### Build for Production
```bash
# Build frontend
npm run build

# Start production server
npm run server
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Review the debugging section above
3. Check test outputs for error details
4. Open a new issue with detailed information

## 🎯 Learning Outcomes

This project demonstrates:
- Full-stack MERN application development
- Comprehensive testing strategies
- Effective debugging techniques
- Error handling and validation
- API design and documentation
- Responsive UI/UX design
- Code organization and maintainability
