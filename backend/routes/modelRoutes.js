const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');
const { giveResult, toggleSimulation, getSimulationStatus } = require('../controllers/modelController');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
});

const router = express.Router();

router.post('/give-result', upload.single('file'), giveResult);
router.post('/toggle-simulation', toggleSimulation);
router.get('/simulation-status', getSimulationStatus);

module.exports = router;
