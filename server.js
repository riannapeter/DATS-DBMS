// backend/server.js
const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "DATSdbms1234",
  database: "dats",
  port: 3307
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../safetravelfrontend")));

app.get("/api/alerts", (req, res) => {
  db.query("SELECT * FROM alerts", (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.get("/api/risk", (req, res) => {
  const { lat, lon } = req.query;
  let risk = "Safe";
  for (const alert of alerts) {
    const dist = Math.sqrt((alert.lat - lat) ** 2 + (alert.lon - lon) ** 2);
    if (dist < 1.5 && alert.severity === "High") {
      risk = "High";
      break;
    } else if (dist < 3) {
      risk = "Moderate";
    }
  }
  res.json({
    risk,
    description:
      risk === "High"
        ? "High-risk zone! Avoid travel if possible."
        : risk === "Moderate"
        ? "Nearby hazards detected — stay cautious."
        : "Safe for travel.",
  });
});

// API: Get routes
app.get("/api/routes", (req, res) => {
  const { origin, destination } = req.query;
  res.json([
    {
      id: "A",
      summary: `${origin} → ${destination} (Direct Route)`,
      duration: "2h 15m",
      risk: "Moderate",
    },
    {
      id: "B",
      summary: `${origin} → ${destination} (Alternate Route)`,
      duration: "2h 40m",
      risk: "Safe",
    },
  ]);
});

// Serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../safetravelfrontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ DATS running at http://localhost:${PORT}`);
});