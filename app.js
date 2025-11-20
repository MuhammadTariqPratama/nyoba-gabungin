const express = require("express");
const app = express();
require("dotenv").config();
const sequelize = require("./models/index");
const swaggerDocs = require("./swagger/swagger");
const path = require("path");


// sync db
const Admin = require("./models/admin");
const Produk = require("./models/produk");
const Pemasok = require("./models/pemasok");
const variasi = require("./models/variasi");
const AlurBarang = require("./models/alurBarang");
// sequelize.sync();

// sequelize.sync({ alter: true })
//   .then(() => console.log("Database synced"))
//   .catch(err => console.error(err));



app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "API telah berjalan" });
});

// routes
app.use("/admin", require("./routes/adminRoutes"));
app.use("/produk", require("./routes/produkRoutes"));
app.use("/pemasok", require("./routes/pemasokRoutes"));
app.use("/variasi", require("./routes/variasiRoutes"));
app.use("/alurBarang", require("./routes/alurBarangRoutes"));
app.use("/uploads", express.static("public/uploads"));


// Swagger Docs
swaggerDocs(app);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));