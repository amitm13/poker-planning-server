# Poker Planning Server

A real-time Story Point estimation server built with Node.js, Express, and Firebase. This server provides the backend API for the Poker Planning application, enabling teams to conduct agile estimation sessions efficiently.

## 🚀 Features

- **User Authentication**
  - Firebase Authentication integration
  - Secure user management
  - Profile customization

- **Session Management**
  - Create private/public planning sessions
  - Join sessions via unique codes
  - View session history
  - Real-time session updates

- **Planning Features**
  - Real-time voting system
  - Multiple point systems (Fibonacci, Sequential, T-shirt sizes)
  - Vote revelation control
  - Session statistics and results
  - Participant management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Real-time Updates**: Firebase Realtime Features

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase Project with Firestore and Authentication enabled

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amitm13/poker-planning-server.git
   cd poker-planning-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add the following configurations:
     ```env
     # Firebase Configuration
     FIREBASE_SERVICE_ACCOUNT={"your-service-account-json"}
     FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com

     # Server Configuration
     PORT=5000
     ```

4. **Start the server**
   ```bash
   npm start
   ```

## 🔌 API Endpoints

### Authentication
All endpoints require Firebase Authentication token in the header:
```
Authorization: Bearer <firebase-id-token>
```

### Sessions
- `POST /api/sessions/create`
  - Create a new planning session
  - Body: `{ name, pointSystem, isPublic }`

- `POST /api/sessions/:sessionCode/join`
  - Join an existing session
  - Params: `sessionCode`

- `POST /api/sessions/:sessionCode/vote`
  - Submit a vote in a session
  - Params: `sessionCode`
  - Body: `{ vote }`

- `POST /api/sessions/:sessionCode/reveal`
  - Reveal votes in a session
  - Params: `sessionCode`

- `GET /api/sessions/history`
  - Get user's session history

### Users
- `GET /api/users/profile`
  - Get user profile

- `PUT /api/users/profile`
  - Update user profile
  - Body: `{ displayName, photoURL }`

## 🔒 Security

- All API endpoints are protected with Firebase Authentication
- Session access control for private/public sessions
- Input validation and sanitization
- Error handling and logging

## 🚧 Error Codes

- `401` - Unauthorized (Invalid or missing token)
- `403` - Forbidden (Not allowed to access resource)
- `404` - Not Found (Resource doesn't exist)
- `500` - Internal Server Error

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Project Structure

```
server/
├── controllers/         # Route controllers
├── middleware/         # Custom middleware
├── routes/            # API routes
├── services/          # Business logic
├── index.js          # Entry point
└── README.md         # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Amit M** - *Initial work* - [amitm13](https://github.com/amitm13)

## 🙏 Acknowledgments

- Firebase team for the excellent backend services
- Express.js community for the robust framework
- All contributors who participate in this project
