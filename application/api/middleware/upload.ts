import multer, { diskStorage } from 'multer';
  
var storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
  
export const upload = multer({ storage: storage });