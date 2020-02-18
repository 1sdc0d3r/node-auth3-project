const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const server = express();

server.use(morgan("combined"));
server.use(helmet());
server.use(express.json());

server.get("/api/users", (req, res) => {});
server.post("/api/register", (req, res) => {});
server.post("/api/login", (req, res) => {});

server.use("/", (req, res) => {
  res.status(200).send("api is working");
});

module.exports = server;
