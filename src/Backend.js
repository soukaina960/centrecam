const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const app = express();

// Configurer multer pour gérer les fichiers téléchargés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const className = req.body.className;
    const fileType = req.body.fileType;
    const folderPath = path.join(__dirname, "uploads", className, fileType);
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const fileName = `${req.body.fileName}.pdf`;
    cb(null, fileName); // Sauvegarder sous le nom spécifié
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers PDF sont autorisés."), false);
    }
  },
});

// Route d'upload de fichier
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("Fichier téléchargé avec succès !");
});

// Route pour lister les fichiers disponibles par classe et type
app.get("/files", (req, res) => {
  const { className, fileType } = req.query; // Classe et type reçus comme paramètres
  
  const folderPath = path.join(__dirname, "uploads", className, fileType);
  
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).send("Erreur lors de la lecture des fichiers.");
    }
    
    // Retourner la liste des fichiers
    res.json(files);
  });
});

// Démarrer le serveur
app.listen(5000, () => {
  console.log("Serveur démarré sur le port 5000");
});
