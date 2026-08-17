require("dotenv").config();

// ============================================================
// T005 — JWT_SECRET startup validation (Wave 0 / Security)
// Server refuses to start if JWT_SECRET is missing or insecure.
// ============================================================
const INSECURE_DEFAULTS = ["dev_secret_change_me", "secret", "changeme", ""];
const _jwtSecret = process.env.JWT_SECRET;

if (!_jwtSecret || INSECURE_DEFAULTS.includes(_jwtSecret.trim())) {
  console.error("============================================================");
  console.error("FATAL: JWT_SECRET is missing or set to an insecure default.");
  console.error("Set a strong, unique JWT_SECRET in your environment before starting.");
  console.error("Server will not start.");
  console.error("============================================================");
  process.exit(1);
}

const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health");
const authRoutes = require("./routes/auth");
const salesRoutes = require("./routes/sales");
const rfmRoutes = require("./routes/rfm");
const filtersRouter = require("./routes/filters");
const salesPipelineRoutes = require("./routes/sales-pipeline");
const inventoryRoutes = require("./routes/inventory");
const financeRoutes = require("./routes/finance");
const analyticsRoutes = require("./routes/analytics");
const aiRoutes = require("./routes/ai");
const insightsRoutes = require("./routes/insights");
const businessInsightsRoutes = require("./routes/businessInsights");
const pipelineRoutes = require("./routes/pipeline"); // For ETL data load pipeline
const supplyRoutes = require("./routes/supply");
const executiveRoutes = require("./routes/executive");
const settingsRoutes = require("./routes/settings");
const adminRoutes = require("./routes/admin");
const internalEtlRoutes = require("./routes/internalEtl");

const { getFinanceRiskBundle } = require("./services/financeRisk");

const app = express();

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Middleware to inject data freshness metadata
app.use((req, res, next) => {
  res.set("X-Data-Freshness", new Date().toISOString());
  res.set("X-Data-Source", "Operational Database");
  next();
});

app.use("/api/internal/etl", internalEtlRoutes);
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", salesRoutes);
app.use("/api", rfmRoutes);
app.use("/api", filtersRouter);
app.use("/api", salesPipelineRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", financeRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", aiRoutes);
app.use("/api", insightsRoutes);
app.use("/api", businessInsightsRoutes);
app.use("/api/pipeline", pipelineRoutes);
app.use("/api/supply", supplyRoutes);
app.use("/api/executive", executiveRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/forecast-test", (_req, res) => {
  res.json({ ok: true, route: "forecast-test" });
});

app.get("/api/kpi/sales/forecast-quarterly-test", (_req, res) => {
  res.json({ ok: true, route: "forecast-quarterly-test" });
});

console.log("====================================");
console.log("DQ Orbit — Decision Intelligence Platform");
console.log("Backend API Server v2.0");
console.log("Working dir:", process.cwd());
console.log("DATABASE_URL cargada:", !!process.env.DATABASE_URL);
console.log("====================================");

app.listen(3000, async () => {
  console.log("DQ Orbit API running on port 3000");

  try {
    console.log("Precalentando cache financiero...");
    await getFinanceRiskBundle();
    console.log("Cache financiero precalentado correctamente");
  } catch (e) {
    console.error("No se pudo precalentar cache financiero:", e.message);
  }
});