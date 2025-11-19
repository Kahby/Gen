# Prompt Masters

Prompt submission and evaluation platform for managing creative prompts across multiple themes including memes, art, stories, music, and poetry.

## Features

- 🎨 **5 Creative Themes**: Meme Generation, AI Visual Art, Digital Storytelling, Song Factory, and Poetry
- 📊 **Submission Tracking**: Precision, Design, Creativity, Accuracy, and Overall score fields recorded for each entry
- 🏆 **Category Leaderboards**: Upload curated Excel leaderboards per category and display them publicly
- 🔐 **User Authentication**: Secure login with @vitbhopal.ac.in email validation
- 📁 **File Upload**: Support for .mp3, .png, .jpg, .jpeg files
- 📈 **Admin Dashboard**: View submissions, export to Excel, download files
- 🚀 **Modern Stack**: React + Vite frontend, Node.js + Express backend

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Recharts
- Lucide React

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Multer (file uploads & leaderboards)
- ExcelJS (Excel export & parsing)

## Project Structure

```
GenAi Club/
├── server/              # Backend API
│   ├── models/          # Mongoose models
│   ├── uploads/         # Uploaded files
│   ├── server.js        # Main server file
│   └── package.json
├── vite-project/        # Frontend React app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── config/      # Configuration
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=*
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

### Frontend Setup

1. Navigate to vite-project directory:
```bash
cd vite-project
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file for custom backend URL:
```env
VITE_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Submissions
- `POST /api/submissions` - Submit a new prompt (with file upload)
- `GET /api/submissions` - Get all submissions
- `GET /api/export-submissions` - Export to Excel (admin-only token header)
- `GET /api/files` - List uploaded files
- `GET /api/download-file/:id` - Download file

### Leaderboards
- `POST /api/admin/leaderboard/upload` - Admin upload endpoint for Excel leaderboard files
- `GET /api/leaderboard/:category` - Public endpoint returning leaderboard data for a category
- `POST /api/admin/leaderboard/visibility` - Publish or hide a category leaderboard (admin token required)
- `POST /api/admin/leaderboard/reset` - Delete the uploaded leaderboard + Excel file for a category

## Environment Variables

### Backend (`server/.env`)
- `MONGODB_URI` - MongoDB connection string (required)
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS (default: *)

### Frontend (`vite-project/.env`)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## Security Notes

⚠️ **Never commit `.env` files to version control!**

- All sensitive credentials are stored in `.env` files
- `.env` files are already in `.gitignore`
- API keys and database URLs are required at runtime

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

See [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) for GitHub deployment guide.

## License

This project is organized by GAI VIT Bhopal.

## Contact

VIT Bhopal University, Kothrikalan, Sehore, Pin - 466114

---

**From Prompts to Progress** 🚀

