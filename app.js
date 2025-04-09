const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.port || 3000;

const users = require("./routes/users");
const cocheras = require("./routes/cochera");
const reservas = require("./routes/reservas");

app.use(cors());
app.use(express.json());
app.use("/users", users);
app.use("/cocheras", cocheras);
app.use("/reservas", reservas);

app.listen(PORT, () => {
    console.log("Server Listening in", PORT);  
});