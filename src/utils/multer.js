import multer from "multer";
import { __mainDirname } from './path.js';

function typeFile(req, file, cb) {
    const fileType = req.body.fileType;

    let destination = `${__mainDirname}/uploads/documents`;

    const fileTypeMappings = {
        'profile': `${__mainDirname}/uploads/profile`,
        'product': `${__mainDirname}/uploads/products`,
        'document': `${__mainDirname}/uploads/documents`
    };

    if (fileTypeMappings[fileType]) {
        destination = fileTypeMappings[fileType];
    }

    cb(null, destination);
}

const storage = multer.diskStorage({
    destination: typeFile,

    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({
    storage, onError: (err, next) => {
        console.log(err);
        next();
    }
});

export default uploader;