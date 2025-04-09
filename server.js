const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize }= require("./utils/db"); 
const initModels = require("./models/init-models");
const models = initModels(sequelize);

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());



const reportRoutes = require("./Routes/reportRoutes");
app.use("/api/reports", reportRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
