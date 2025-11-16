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
GROQ_API_KEY=your_groq_api_key_here
FRONTEND_URL=*  # Optional: Set to your frontend URL for CORS restriction
```

**Important:** 
- `MONGODB_URI` and `GROQ_API_KEY` are **REQUIRED** - the server will not start without them
- Get your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or use your local MongoDB URI
- Get your Groq API key from [Groq Console](https://console.groq.com/)
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
Exports all form submissions from MongoDB to an Excel (.xlsx) file.

**Response:** Downloads an Excel file named `submissions_export.xlsx`

**Example:**
```bash
curl http://localhost:5000/api/export-submissions --output submissions.xlsx
```

### POST `/api/submissions`
Submit a new form submission. The prompt will be automatically analyzed using Groq API (Llama 3.1 8B Instant) to generate scores.

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

## AI-Powered Prompt Analysis

The system uses **Groq API** with **Llama 3.1 8B Instant** model to automatically analyze submitted prompts and generate scores:

- **Precision (0-100)**: Clarity and specificity of the prompt
- **Design Quality (0-100)**: Structure and organization
- **Creativity (0-100)**: Innovation and originality
- **Accuracy (0-100)**: Likelihood of producing expected output
- **Overall (0-100)**: Comprehensive evaluation

Scores are automatically calculated when a submission is created via the POST endpoint.

## Notes

- The Excel export endpoint uses `exceljs` library
- Data is fetched using `.lean()` for better performance
- The export includes all fields from the FormSubmission model
- Headers are automatically styled in bold
- Prompt analysis uses Groq API with Llama 3.1 8B Instant model
- Analysis happens automatically on form submission

