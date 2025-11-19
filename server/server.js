const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Add these imports
const ExcelJS = require('exceljs');
// Please verify this path is correct for my project structure
const FormSubmission = require('./models/FormSubmission');
const User = require('./models/User');
const Leaderboard = require('./models/Leaderboard');

// Hardcoded admin credentials
const ADMIN_USERS = [
  { email: 'admin1@promptmasters.com', password: 'Admin@123' },
  { email: 'admin2@promptmasters.com', password: 'AdminTwo#2024' }
];
const ADMIN_ACCESS_TOKEN = 'promptmasters_admin_secure_token_v1';
const LEADERBOARD_CATEGORIES = {
  meme: 'Meme Generation',
  art: 'AI Visual Art',
  storytelling: 'AI Digital Storytelling',
  song: 'AI Song Factory',
  poetry: 'AI-generated Poetry'
};
const CATEGORY_KEYS = Object.keys(LEADERBOARD_CATEGORIES);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS configuration - allows requests from any origin
// For production, you may want to restrict this to specific origins
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Use '*' for all origins, or set specific URL like 'https://yourdomain.com'
  credentials: true, // Allow cookies/credentials if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for submission file uploads
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

// Leaderboard uploads
const leaderboardUploadsDir = path.join(uploadsDir, 'leaderboards');
if (!fs.existsSync(leaderboardUploadsDir)) {
  fs.mkdirSync(leaderboardUploadsDir, { recursive: true });
}

const leaderboardStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, leaderboardUploadsDir);
  },
  filename: (req, file, cb) => {
    const category = req.body.category || 'general';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || '.xlsx';
    const sanitizedCategory = category.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${sanitizedCategory}_${timestamp}${ext}`);
  }
});

const leaderboardFileFilter = (req, file, cb) => {
  const allowedTypes = /excel|spreadsheetml|sheet|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet|csv/;
  const extAllowed = /\.(xlsx|xls|csv)$/i.test(file.originalname);
  if (allowedTypes.test(file.mimetype) || extAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files (.xlsx, .xls, .csv) are allowed for leaderboard uploads.'));
  }
};

const leaderboardUpload = multer({
  storage: leaderboardStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: leaderboardFileFilter
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

// POST endpoint: Admin panel login (hardcoded credentials)
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      message: 'Missing credentials',
      error: 'Email and password are required'
    });
  }

  const adminMatch = ADMIN_USERS.find(
    (admin) => admin.email.toLowerCase() === email.toLowerCase() && admin.password === password
  );

  if (!adminMatch) {
    return res.status(401).json({
      message: 'Unauthorized',
      error: 'Invalid admin credentials'
    });
  }

  res.json({
    message: 'Admin authentication successful',
    token: ADMIN_ACCESS_TOKEN
  });
});

function validateAdminToken(req, res) {
  const adminToken = req.headers['x-admin-token'] || '';
  if (adminToken !== ADMIN_ACCESS_TOKEN) {
    res.status(403).json({
      message: 'Unauthorized',
      error: 'Admin token missing or invalid'
    });
    return false;
  }
  return true;
}

// POST endpoint: Upload leaderboard Excel for a category
app.post('/api/admin/leaderboard/upload', leaderboardUpload.single('leaderboard'), async (req, res) => {
  if (!validateAdminToken(req, res)) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return;
  }

  const { category } = req.body || {};

  if (!category || !CATEGORY_KEYS.includes(category)) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({
      message: 'Invalid category',
      error: 'Category is required and must be one of the supported categories'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: 'Missing file',
      error: 'Please upload an Excel file for the leaderboard'
    });
  }

  let uploadSucceeded = false;
  const workbook = new ExcelJS.Workbook();
  let previousFilePath = null;

  try {
    const existingLeaderboard = await Leaderboard.findOne({ category });
    if (existingLeaderboard?.sourceFilePath) {
      previousFilePath = path.join(leaderboardUploadsDir, existingLeaderboard.sourceFilePath);
    }

    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new Error('Unable to read worksheet from uploaded file');
    }

    const entries = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      const rankCell = row.getCell(1).value;
      const teamCell = row.getCell(2).value;
      const scoreCell = row.getCell(3).value;
      const notesCell = row.getCell(4).value;

      const teamName = (teamCell && teamCell.toString().trim()) || '';
      if (!teamName) return;

      entries.push({
        rank: Number(rankCell) || entries.length + 1,
        teamName,
        score: Number(scoreCell) || 0,
        notes: notesCell ? notesCell.toString().trim() : ''
      });
    });

    const updates = {
      entries,
      uploadedAt: new Date(),
      isVisible: false,
      sourceFileName: req.file.originalname,
      sourceFilePath: req.file.filename
    };

    const updatedDoc = await Leaderboard.findOneAndUpdate(
      { category },
      updates,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    uploadSucceeded = true;

    if (previousFilePath && fs.existsSync(previousFilePath) && previousFilePath !== req.file.path) {
      try {
        fs.unlinkSync(previousFilePath);
      } catch (cleanupError) {
        console.warn('Failed to remove previous leaderboard file:', cleanupError.message);
      }
    }

    res.json({
      message: 'Leaderboard uploaded successfully',
      category,
      totalEntries: entries.length,
      isVisible: updatedDoc.isVisible
    });
  } catch (error) {
    console.error('Error processing leaderboard upload:', error);
    res.status(500).json({
      message: 'Failed to process leaderboard',
      error: error.message
    });
  } finally {
    if (!uploadSucceeded && req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

// GET endpoint: Retrieve leaderboard by category
app.get('/api/leaderboard/:category', async (req, res) => {
  const { category } = req.params;

  if (!CATEGORY_KEYS.includes(category)) {
    return res.status(400).json({
      message: 'Invalid category',
      error: 'Unsupported category'
    });
  }

  try {
    const leaderboard = await Leaderboard.findOne({ category }).lean();
    const isVisible = Boolean(leaderboard?.isVisible);
    const entries = leaderboard?.entries || [];
    const hasEntries = entries.length > 0;

    res.json({
      category,
      categoryLabel: LEADERBOARD_CATEGORIES[category],
      entries: isVisible ? entries : [],
      updatedAt: isVisible ? leaderboard?.uploadedAt || null : null,
      isVisible,
      hasEntries,
      sourceFileName: leaderboard?.sourceFileName || null,
      message: isVisible ? null : 'Leaderboard not yet published'
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
});

// POST endpoint: Toggle leaderboard visibility
app.post('/api/admin/leaderboard/visibility', async (req, res) => {
  if (!validateAdminToken(req, res)) {
    return;
  }

  const { category, visible } = req.body || {};

  if (!category || !CATEGORY_KEYS.includes(category)) {
    return res.status(400).json({
      message: 'Invalid category',
      error: 'Category is required and must be one of the supported categories'
    });
  }

  if (typeof visible === 'undefined') {
    return res.status(400).json({
      message: 'Missing visibility flag',
      error: 'Please include visible=true|false in the request body'
    });
  }

  try {
    const leaderboard = await Leaderboard.findOneAndUpdate(
      { category },
      { isVisible: Boolean(visible) },
      { new: true }
    );

    if (!leaderboard) {
      return res.status(404).json({
        message: 'Leaderboard not found',
        error: 'Upload leaderboard data before toggling visibility'
      });
    }

    res.json({
      message: `Leaderboard ${visible ? 'published' : 'hidden'} successfully`,
      category,
      isVisible: leaderboard.isVisible
    });
  } catch (error) {
    console.error('Error updating leaderboard visibility:', error);
    res.status(500).json({
      message: 'Failed to update visibility',
      error: error.message
    });
  }
});

// POST endpoint: Reset leaderboard data and delete uploaded file
app.post('/api/admin/leaderboard/reset', async (req, res) => {
  if (!validateAdminToken(req, res)) {
    return;
  }

  const { category } = req.body || {};

  if (!category || !CATEGORY_KEYS.includes(category)) {
    return res.status(400).json({
      message: 'Invalid category',
      error: 'Category is required and must be one of the supported categories'
    });
  }

  try {
    const leaderboard = await Leaderboard.findOneAndDelete({ category });

    if (!leaderboard) {
      return res.status(404).json({
        message: 'No leaderboard to reset',
        error: 'Upload a leaderboard before attempting to reset'
      });
    }

    if (leaderboard.sourceFilePath) {
      const filePath = path.join(leaderboardUploadsDir, leaderboard.sourceFilePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      message: 'Leaderboard reset successfully',
      category
    });
  } catch (error) {
    console.error('Error resetting leaderboard:', error);
    res.status(500).json({
      message: 'Failed to reset leaderboard',
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

    // Use default zero scores (no AI analysis)
    const scores = {
      precision: 0,
      design: 0,
      creativity: 0,
      accuracy: 0,
      overall: 0
    };

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

