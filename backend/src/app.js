const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const challanRoutes = require("./routes/challan.routes");

const app = express();

const allowedOrigins = [
  (process.env.FRONTEND_URL || "").replace(/\/$/, ""),
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static("src/uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/challans", challanRoutes);

app.get("/", (req, res) => {
  res.send("Challan Settler API running");
});

module.exports = app;