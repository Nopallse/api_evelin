const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads_poster');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ 
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
  })
});


module.exports = { upload };