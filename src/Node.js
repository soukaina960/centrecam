const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const rateLimit = require("express-rate-limit");

const app = express();
app.use(express.json());

const SECRET_KEY = "votre-clé-secrète";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite de 5 tentatives
});

app.use("/login", limiter);

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Validation
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Vérification de l'utilisateur (exemple simplifié)
  const user = { id: 1, email: "soso@gmail.com", password: await bcrypt.hash("123456", 10) };
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch || email !== user.email) {
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });
  }

  // Génération du token JWT
  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

app.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
});