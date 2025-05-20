// const { Document } = require('../models');
// const multer = require('multer');
// const path = require('path');

// // Configure multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Store files in 'uploads/' directory
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const filetypes = /pdf|doc|docx|txt/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed!'));
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// }).single('document');

// // Upload a society-related document
// const uploadDocument = async (req, res) => {
//   try {
//     // Run multer middleware to handle file upload
//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(400).json({ error: err.message });
//       }

//       if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//       }

//       const userId = req.user?.user_id;
//       if (!userId) {
//         return res.status(401).json({ error: 'Unauthorized' });
//       }

//       // Save document metadata to the database
//       const document = await Document.create({
//         fileName: req.file.originalname,
//         filePath: req.file.path,
//         uploadedBy: userId,
//       });

//       res.status(201).json({ message: 'Document uploaded successfully', document });
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Fetch all uploaded documents
// const getAllDocuments = async (req, res) => {
//   try {
//     const documents = await Document.findAll({
//       attributes: { exclude: ['filePath'] }, // Exclude filePath for security (optional)
//     });

//     if (!documents.length) {
//       return res.status(404).json({ error: 'No documents found' });
//     }

//     res.json(documents);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = {
//   uploadDocument,
//   getAllDocuments,
// };