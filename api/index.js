require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
const port = process.env.PORT;
const connectToMongo = require("./config/database")
connectToMongo();
app.use(express.json());
app.use(cors());

app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static('uploads'));

app.use("/api/events",require("./routes/events.js"));
app.use("/api/auth",require("./routes/auth.js"));
app.use("/api/faculties",require("./routes/faculties.js"))
app.use("/api/students",require("./routes/students.js"))

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
