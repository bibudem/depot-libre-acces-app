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

// Créer le dossier logs s'il n'existe pas
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Fonction pour écrire les logs dans un fichier CSV
function logFileDetails(file) {
  const csvWriter = createCsvWriter({
    path: logFile,
    header: [
      { id: 'date', title: 'DATE' },
      { id: 'time', title: 'TIME' },
      { id: 'fileName', title: 'FILENAME' },
      { id: 'fileSize', title: 'SIZE (bytes)' }
    ],
    fieldDelimiter: ';',
    append: true // Ajout des lignes si le fichier existe
  });

  const now = moment();
  const record = [{
    date: now.format('YYYY-MM-DD'),
    time: now.format('HH:mm:ss'),
    fileName: file.filename,
    fileSize: file.size
  }];

  // Écrire les enregistrements dans le fichier CSV
  csvWriter.writeRecords(record);
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

// Route pour l'upload des fichiers
app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    // Enregistrer les informations dans le fichier CSV
    logFileDetails(req.file);

    res.send({ message: 'Fichier téléchargé avec succès', file: req.file });
  } else {
    res.status(400).send({ message: 'Erreur lors du téléchargement du fichier' });
  }
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});
