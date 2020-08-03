const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const contact = require("./routes/contact");
const user = require("./routes/user");

const logger = require("./middleware/logger");
const error = require("./middleware/error");
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json());

app.use(logger);
app.use(morgan("combined"));

app.use("/api/v1/contact", contact);
app.use("/api/v1/user", user);

app.use(error);

const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV}mode on port ${PORT}`)
);
