const multer = require('multer');
const urlencode = require('urlencode');

module.exports = upload = multer({
  storage: multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/');
  },
  filename: (req, file, cb) => {
    // const fileName = urlencode(file.originalname);
    cb(null, new Date().valueOf() + file.originalname);
  }
})
});

return upload;