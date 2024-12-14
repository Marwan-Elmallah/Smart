const multer = require('multer');

// Create multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/audio'); // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.replace(/\s+/g, '_');
        cb(null, Date.now() + '_' + ext); // Generate a unique filename for the uploaded file
    }
});

// Create file type filter function
const fileFilter = function (req, file, cb) {
    // Check if the file type is acceptable
    if (file.mimitype == 'audio/flac' ||
        file.mimetype == 'audio/x-m4a' ||
        file.mimetype == 'audio/mp3' ||
        file.mimetype == 'audio/mp4' ||
        file.mimetype == 'audio/mpeg' ||
        file.mimetype == 'audio/mpga' ||
        file.mimetype == 'audio/oga' ||
        file.mimetype == 'audio/ogg' ||
        file.mimetype == 'audio/wav' ||
        file.mimetype == 'audio/webm'
    ) {
        // Accept the file
        // console.log(`format of file is: ${file.mimetype}`);
        cb(null, true);
    } else {
        // Reject the file
        console.log(`format of error file is: ${file.mimetype}`);
        cb(new Error('Error: Unsupported file type. Please upload an Supported formats: ["flac", "m4a", "mp3", "mp4", "mpeg", "mpga", "oga", "ogg", "wav", "webm"] file.'))
    }
};

// Create multer instance with the storage configuration and file type filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Middleware function to handle audio file uploads
const uploadFile = upload.single('audio'); // 'audio' is the field name in the form-data

module.exports = { uploadFile };
