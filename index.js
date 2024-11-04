const express=require('express');
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
console.log(process.env.DB_URL);
const dbConnection = require("./config/database.js");
// Connect with db
dbConnection();
const app=express();
const eventRoute=require("./routes/eventRoute.js")
app.use(express.json());

app.use("/api/Event", eventRoute);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});