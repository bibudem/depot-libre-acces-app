const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
app.use(cors());

const logDir = path.join(__dirname, 'logs');
const logFile = path.join(logDir, 'upload_logs.csv');

const IS_LOCAL = process.env.NODE_ENV !== 'production';

// Créer le dossier logs s'il n'existe pas
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const csvWriter = createCsvWriter({
  path: logFile,
  header: [
    { id: 'date', title: 'DATE' },
    { id: 'time', title: 'TIME' },
    { id: 'fileName', title: 'FILENAME' },
    { id: 'fileSize', title: 'SIZE_BYTES' },
    { id: 'isAcceptedManuscript', title: 'MANUSCRIT_ACCEPTE' },
    { id: 'license', title: 'LICENCE' },
    { id: 'comments', title: 'COMMENTAIRES' }
  ],
  fieldDelimiter: ';',
  append: fs.existsSync(logFile)
});


// Fonction pour écrire les logs dans un fichier CSV
function logFileDetails(file, metadata = {}) {
  const now = moment();

  return csvWriter.writeRecords([{
    date: now.format('YYYY-MM-DD'),
    time: now.format('HH:mm:ss'),
    fileName: file.filename,
    fileSize: file.size,
    isAcceptedManuscript: metadata.isAcceptedManuscript,
    license: metadata.license,
    comments: metadata.comments
  }]);
}


// Fonction pour nettoyer le nom de fichier
function cleanFileName(fileName) {
  const cleanedName = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '')
    .toLowerCase();
  return cleanedName;
}

function sanitizeString(str, maxLength = 500) {
  if (!str) return '';

  // Supprimer les balises HTML / scripts
  let sanitized = str.replace(/<[^>]*>?/gm, '');

  // Supprimer les caractères non imprimables / contrôle
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  // Échapper les caractères spéciaux pour CSV
  sanitized = sanitized.replace(/;/g, ','); // remplacer le ; par , pour ne pas casser le CSV

  // Tronquer si trop long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized.trim();
}


// Configurer Multer pour gérer le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const currentDate = moment().format('YYYY-MM-DD');
    const uploadDir = `uploads/${currentDate}/`;
    // Si le répertoire n'existe pas, le créer
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const cleanedName = cleanFileName(path.basename(file.originalname, path.extname(file.originalname)));
    const currentDate = moment().format('YYYY-MM-DD');
    const finalFileName = `${cleanedName}_${currentDate}${path.extname(file.originalname)}`;
    cb(null, finalFileName);
  },
});

const upload = multer({ storage });

// Middleware pour vérifier l'authentification
function checkAuth(req, res, next) {
  if (IS_LOCAL) {
    return next(); // 
  }

  if (!req.isAuthenticated || !req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
}


// Ajustement de la route upload avec la vérification
app.post('/upload', checkAuth, upload.single('file'), async (req, res) => {
   //console.log('BODY:', req.body);

  if (!req.file) {
    return res.status(400).json({ message: 'No file' });
  }

  await logFileDetails(req.file, {
    isAcceptedManuscript: sanitizeString(req.body.isAcceptedManuscript, 3), // OUI/NON
    license: sanitizeString(req.body.license, 50),
    comments: sanitizeString(req.body.comments, 500)
  });

  res.json({ message: 'Upload OK' });
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
