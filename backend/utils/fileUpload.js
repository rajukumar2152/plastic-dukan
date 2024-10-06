const multer = require('multer');
const path = require('path');

// Configure multer storage for saving uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // directory to store uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // save file with unique name
    }
});

// Filter to only accept image files (optional but recommended)
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: imageFilter
});

module.exports={
    upload
}

