require("dotenv").config();
const express = require("express");
const cors = require("cors");
const checkJwt = require("./authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/public", (req, res) => {
  res.json({ message: "Anyone can access this." });
});

app.get("/api/protected", checkJwt, (req, res) => {
  res.json({
    message: `This is protected data for ${req.auth.sub}`,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
