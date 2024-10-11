const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors()); // Autoriser les requêtes cross-origin depuis Angular

// Configurer Multer pour gérer le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Ajouter un timestamp pour rendre le nom de fichier unique
    },
});

const upload = multer({ storage });

// Route pour l'upload des fichiers
app.post('/upload', upload.single('file'), (req, res) => {
    res.send({ message: 'Fichier téléchargé avec succès', file: req.file });
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
