# Prompt Masters Backend Server

Backend API server for the Prompt Masters application with MongoDB to Excel export functionality.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
FRONTEND_URL=*  # Optional: Set to your frontend URL for CORS restriction
```

**Important:** 
- `MONGODB_URI` is **REQUIRED** - the server will not start without it
- Get your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or use your local MongoDB URI
- Never commit your `.env` file to version control

3. Make sure MongoDB is running on your system.

4. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### GET `/api/export-submissions`
Exports all form submissions from MongoDB to an Excel (.xlsx) file. Requires `x-admin-token` header.

**Response:** Downloads an Excel file named `submissions_export.xlsx`

### POST `/api/submissions`
Submit a new form submission. Score fields (precision, design, creativity, accuracy, overall) are stored with default value `0`.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "teamNumber": "Team 10",
  "registrationNumber": "24BCE1234",
  "category": "art",
  "prompt": "Create a futuristic cityscape...",
  "outputFileName": "output.jpg"
}
```

**Response:** Returns the saved submission with AI-generated scores.

### GET `/api/submissions`
Returns all form submissions as JSON (for testing).

### POST `/api/admin/leaderboard/upload`
Admin-only endpoint to upload an Excel leaderboard for a category. Accepts `category` form field and `leaderboard` file (`.xlsx`, `.xls`, `.csv`). Replaces any existing leaderboard for that category.

### GET `/api/leaderboard/:category`
Public endpoint returning leaderboard entries for the requested category (meme, art, storytelling, song, poetry).

### POST `/api/admin/leaderboard/visibility`
Admin-only endpoint to publish (`visible=true`) or hide (`visible=false`) a leaderboard for a category. Requires the `x-admin-token` header.

### POST `/api/admin/leaderboard/reset`
Admin-only endpoint that deletes the stored leaderboard data and removes the uploaded Excel file for a category. Requires the `x-admin-token` header.

## FormSubmission Model

The FormSubmission model includes:
- `fullName` (String, required)
- `teamNumber` (String, required)
- `registrationNumber` (String, required)
- `category` (String, required - enum: 'meme', 'art', 'storytelling', 'song', 'poetry')
- `prompt` (String, required)
- `outputFileName` (String, optional)
- `scores` (Object with: precision, design, creativity, accuracy, overall)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

## Notes

- The Excel export and leaderboard parsing use the `exceljs` library
- Data is fetched using `.lean()` for better performance
- The export includes all fields from the FormSubmission model
- Headers are automatically styled in bold
- Leaderboards remain hidden until an admin publishes them using the visibility endpoint
- Uploaded leaderboard Excel files are stored under `server/uploads/leaderboards/`; resetting or re-uploading cleans up the previous file

