# LitCode 🔥

LitCode is a competitive 1v1 coding platform where developers can challenge each other to solve algorithmic problems in real-time. Think of it as a multiplayer version of LeetCode where you can directly compete against other programmers!


## 📺 Quick Demo

[![LitCode Demo](https://img.youtube.com/vi/Hg4UC5cIdhc/0.jpg)](https://www.youtube.com/watch?v=Hg4UC5cIdhc)

*Watch how LitCode brings competitive programming to life! See real-time battles between coders competing to solve algorithmic challenges.*

## 🎮 How It Works

1. Queue up for a match by selecting your preferred problem category:
   - Graph Problems
   - Tree Traversals
   - Array Manipulations
   - And more!

2. Get matched with another player in your skill range
3. Race to solve the coding challenge
4. First person to pass all test cases wins! 

## 🚀 Features

- Real-time 1v1 coding battles
- Category-based matchmaking system
- Live opponent progress tracking
- Comprehensive test case validation
- Skill-based rating system
- Performance analytics and history
- Custom judge system for code evaluation

## 🛠️ Tech Stack

### Frontend
- **Next.js** with TypeScript for robust client-side application
- Real-time updates using WebSocket connections
- Modern, responsive UI design
- Code editor with syntax highlighting

### Backend
- **Flask** REST API server
- **MongoDB** for storing:
  - User profiles and authentication
  - Coding problems and test cases
  - Match history and statistics
- **JudgeIO** API integration for code compilation and execution
- Secure LAN deployment within McGill University network

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/litcode.git

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
```

## 💻 Development

```bash
# Run frontend development server
npm run dev

# Run backend server
python server/lan_server.py
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Matchmaking
- `POST /api/match/queue` - Enter matchmaking queue
- `DELETE /api/match/queue` - Leave queue
- `GET /api/match/status` - Check match status

### Game
- `POST /api/game/submit` - Submit solution
- `GET /api/game/testcases` - Get problem test cases
- `GET /api/game/opponent-status` - Get opponent's progress

## 🔒 Environment Variables

```
MONGODB_URI=your_mongodb_connection_string
JUDGE_IO_API_KEY=your_judge_io_api_key
SECRET_KEY=your_secret_key
```

## 👥 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- McGill University for providing the network infrastructure
- JudgeIO for the code compilation API
- All contributors and testers who helped make this project possible
