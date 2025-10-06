const express = require("express");
const app = express();
require("dotenv").config();
const sequelize = require("./models/index");
const swaggerDocs = require("./swagger/swagger");

// sync db
const Admin = require("./models/admin");
const Produk = require("./models/produk");
const Pemasok = require("./models/pemasok");
const AlurBarang = require("./models/alurBarang");
sequelize.sync();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "API telah berjalan" });
});

// routes
app.use("/admin", require("./routes/adminRoutes"));
app.use("/produk", require("./routes/produkRoutes"));
app.use("/pemasok", require("./routes/pemasokRoutes"));
app.use("/alurBarang", require("./routes/alurBarangRoutes"));

// Swagger Docs
swaggerDocs(app);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
