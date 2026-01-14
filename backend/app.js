const express = require("express");
const app = express();

app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/test", require("./routes/test.routes"));

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Server error"
  });
});

module.exports = app;
