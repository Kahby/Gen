const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Add these imports
const ExcelJS = require('exceljs');
const Groq = require('groq-sdk');
// Please verify this path is correct for my project structure
const FormSubmission = require('./models/FormSubmission');
const User = require('./models/User');

// Initialize Groq client
if (!process.env.GROQ_API_KEY) {
  console.error('ERROR: GROQ_API_KEY is not set in environment variables');
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration - allows requests from any origin
// For production, you may want to restrict this to specific origins
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Use '*' for all origins, or set specific URL like 'https://yourdomain.com'
  credentials: true, // Allow cookies/credentials if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create filename with teamNumber, timestamp, and original extension
    const teamNumber = req.body.teamNumber || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const sanitizedTeamNumber = teamNumber.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${sanitizedTeamNumber}_${timestamp}_${baseName}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only .mp3, .png, .jpg, .jpeg files
  const allowedTypes = /jpeg|jpg|png|mp3/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .mp3, .png, .jpg, .jpeg files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: fileFilter
});

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// MongoDB connection
if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in environment variables');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Function to analyze prompt using Groq API
async function analyzePrompt(prompt, category) {
  try {
    const analysisPrompt = `You are an expert AI prompt evaluator. Analyze the following prompt and provide scores (0-100) for each criterion.

Prompt Category: ${category}
Prompt to Analyze: "${prompt}"

Evaluate the prompt based on these criteria:

1. **Precision (0-100)**: How precisely does the prompt communicate the intended message? Consider clarity, specificity, and directness of instruction.

2. **Design Quality (0-100)**: How well-structured and organized is the prompt? Evaluate formatting, readability, and overall presentation.

3. **Creativity (0-100)**: How innovative and original is the approach? Does it use creative elements that stand out from conventional prompts?

4. **Accuracy (0-100)**: How likely is this prompt to produce the expected output? Consider if the instructions are clear enough to generate accurate results.

5. **Overall Score (0-100)**: A comprehensive evaluation combining all the above factors.

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks, just the JSON):
{
  "precision": <number>,
  "design": <number>,
  "creativity": <number>,
  "accuracy": <number>,
  "overall": <number>
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a precise AI prompt evaluator. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      model: 'llama-3.1-8b-instant', // Updated: llama-3.1-70b-versatile was decommissioned
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    const scores = JSON.parse(responseText);

    // Validate and ensure scores are within 0-100 range
    return {
      precision: Math.max(0, Math.min(100, parseInt(scores.precision) || 0)),
      design: Math.max(0, Math.min(100, parseInt(scores.design) || 0)),
      creativity: Math.max(0, Math.min(100, parseInt(scores.creativity) || 0)),
      accuracy: Math.max(0, Math.min(100, parseInt(scores.accuracy) || 0)),
      overall: Math.max(0, Math.min(100, parseInt(scores.overall) || 0))
    };
  } catch (error) {
    console.error('Error analyzing prompt with Groq:', error);
    // Return default scores if analysis fails
    return {
      precision: 0,
      design: 0,
      creativity: 0,
      accuracy: 0,
      overall: 0
    };
  }
}

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Prompt Masters API Server is running' });
});

// POST endpoint: Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!email || !email.endsWith('@vitbhopal.ac.in')) {
      return res.status(400).json({
        message: 'Invalid email',
        error: 'Only @vitbhopal.ac.in email addresses are allowed'
      });
    }

    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: 'Invalid password',
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
        error: 'An account with this email already exists. Please login instead.'
      });
    }

    // Create new user (password stored in plain text)
    const user = new User({
      email: email.toLowerCase(),
      password: password
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        email: user.email,
        id: user._id
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      message: 'Error registering user',
      error: error.message
    });
  }
});

// POST endpoint: Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!email || !email.endsWith('@vitbhopal.ac.in')) {
      return res.status(400).json({
        message: 'Invalid email',
        error: 'Only @vitbhopal.ac.in email addresses are allowed'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
        error: 'No account found with this email. Please register first.'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
        error: 'Incorrect password'
      });
    }

    // Login successful
    res.json({
      message: 'Login successful',
      user: {
        email: user.email,
        id: user._id
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
});

// POST endpoint: Submit a new form submission with file upload
app.post('/api/submissions', upload.single('output'), async (req, res) => {
  try {
    const { email, fullName, teamNumber, registrationNumber, category, prompt } = req.body;

    // Validate required fields
    if (!email || !fullName || !teamNumber || !registrationNumber || !category || !prompt) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: 'Missing required fields',
        error: 'All fields are required including email'
      });
    }

    // Validate email format
    if (!email.endsWith('@vitbhopal.ac.in')) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: 'Invalid email',
        error: 'Only @vitbhopal.ac.in email addresses are allowed'
      });
    }

    // Check if user has already submitted
    const existingSubmission = await FormSubmission.findOne({ email: email.toLowerCase() });
    if (existingSubmission >= 3) {
      // Delete uploaded file if user has already submitted
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        message: 'Submission already exists',
        error: 'You have already submitted 3 prompts. Each email can only submit up to 3 times.'
      });
    }

    // Analyze prompt using Groq API to get scores
    console.log('Analyzing prompt with Groq API...');
    const scores = await analyzePrompt(prompt, category);
    console.log('Analysis complete. Scores:', scores);

    // Prepare file information
    const outputFileName = req.file ? req.file.originalname : null;
    const outputFilePath = req.file ? req.file.filename : null;

    // Create new submission with analyzed scores
    const submission = new FormSubmission({
      email: email.toLowerCase(),
      fullName,
      teamNumber,
      registrationNumber,
      category,
      prompt,
      outputFileName: outputFileName || null,
      outputFilePath: outputFilePath || null,
      scores
    });

    // Save to database
    try {
      const savedSubmission = await submission.save();
      res.status(201).json({
        message: 'Submission saved successfully',
        submission: savedSubmission
      });
    } catch (saveError) {
      // Handle unique constraint violation (duplicate email)
      if (saveError.code === 11000 || saveError.name === 'MongoServerError') {
        // Delete uploaded file if duplicate submission
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          message: 'Submission already exists',
          error: 'You have already submitted a prompt. Each email can only submit once.'
        });
      }
      throw saveError; // Re-throw if it's a different error
    }
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error saving submission:', error);
    res.status(500).json({ 
      message: 'Error saving submission',
      error: error.message 
    });
  }
});

// GET endpoint: Get all submissions (optional - for testing)
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await FormSubmission.find({});
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

// --- API Endpoint: Export Submissions to Excel ---

app.get('/api/export-submissions', async (req, res) => {
  try {
    // 1. Fetch all data from MongoDB
    // Using .lean() for faster read-only operations
    const submissions = await FormSubmission.find({}).lean();

    // 2. Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Submissions');

    // 3. Flatten nested scores object for Excel compatibility
    const flattenedSubmissions = submissions.map(sub => ({
      email: sub.email || '',
      fullName: sub.fullName || '',
      teamNumber: sub.teamNumber || '',
      registrationNumber: sub.registrationNumber || '',
      category: sub.category || '',
      prompt: sub.prompt || '',
      outputFileName: sub.outputFileName || '',
      precisionScore: sub.scores?.precision || 0,
      designScore: sub.scores?.design || 0,
      creativityScore: sub.scores?.creativity || 0,
      accuracyScore: sub.scores?.accuracy || 0,
      overallScore: sub.scores?.overall || 0,
      createdAt: sub.createdAt || new Date()
    }));

    // 4. Define columns (key must match the flattened object)
    // Note: 'createdAt' is often added by Mongoose timestamps
    worksheet.columns = [
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Team Number', key: 'teamNumber', width: 15 },
      { header: 'Registration Number', key: 'registrationNumber', width: 20 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Prompt', key: 'prompt', width: 60 },
      { header: 'Output File', key: 'outputFileName', width: 30 },
      { header: 'Precision Score', key: 'precisionScore', width: 15 },
      { header: 'Design Score', key: 'designScore', width: 15 },
      { header: 'Creativity Score', key: 'creativityScore', width: 15 },
      { header: 'Accuracy Score', key: 'accuracyScore', width: 15 },
      { header: 'Overall Score', key: 'overallScore', width: 15 },
      { header: 'Submitted At', key: 'createdAt', width: 20, style: { numFmt: 'yyyy-mm-dd hh:mm:ss' } }
    ];

    // 5. Add the data rows
    worksheet.addRows(flattenedSubmissions);
    
    // 6. Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // 7. Set response headers to trigger download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'submissions_export.xlsx'
    );

    // 8. Write the workbook to the response stream
    await workbook.xlsx.write(res);
    
    // End the response
    res.end();

  } catch (error) {
    console.error('Error exporting data to Excel:', error);
    res.status(500).send({ message: 'Error exporting data' });
  }
});

// --- End of Export Endpoint ---

// GET endpoint: Download output file by submission ID
app.get('/api/download-file/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Find the submission
    const submission = await FormSubmission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (!submission.outputFilePath) {
      return res.status(404).json({ message: 'No file associated with this submission' });
    }

    // Construct file path
    const filePath = path.join(uploadsDir, submission.outputFilePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set headers for download with teamNumber in filename
    const sanitizedTeamNumber = submission.teamNumber.replace(/[^a-zA-Z0-9]/g, '_');
    const originalExt = path.extname(submission.outputFileName || '');
    const downloadFilename = `${sanitizedTeamNumber}_${submission.outputFileName || 'output'}`;

    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
});

// GET endpoint: List all files with team information
app.get('/api/files', async (req, res) => {
  try {
    const submissions = await FormSubmission.find({
      outputFilePath: { $ne: null }
    }).select('teamNumber fullName outputFileName outputFilePath createdAt category _id');

    const files = submissions.map(sub => ({
      submissionId: sub._id,
      teamNumber: sub.teamNumber,
      fullName: sub.fullName,
      fileName: sub.outputFileName,
      filePath: sub.outputFilePath,
      category: sub.category,
      uploadedAt: sub.createdAt,
      downloadUrl: `/api/download-file/${sub._id}`
    }));

    res.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});

