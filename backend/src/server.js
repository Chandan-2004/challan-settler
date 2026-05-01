require("dotenv").config();
const app = require("./app");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

// ✅ CORS (fix your error)
app.use(
  cors({
    origin: "https://challansettler.up.railway.app", // your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Routes (must come BEFORE listen)
app.use("/api/support", require("./routes/support.routes"));
app.use("/api/projects", require("./routes/project.routes"));

// ✅ Start server LAST
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});