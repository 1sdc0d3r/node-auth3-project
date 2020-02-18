const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const db = require("./data/walmart-model");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const server = express();
const sessionConfig = {
  name: "banana", // default "sid"
  secret: process.env.COOKIE_SECRET,
  cookie: {
    maxAge: 1000 * 100,
    secure: false, //true in production
    httpOnly: true //javascript can't access cookie
  },
  reSave: false, //same session, don't reSave
  saveUninitialized: false //GDPR laws against setting cookies automatically
};

server.use(morgan("combined"));
server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));

server.get("/api/users", restricted, (req, res) => {
  db.find().then(users => res.status(200).json(users));
});

server.post("/api/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;
  db.insert(user)
    .then(user =>
      res.status(200).json({ message: "successfully added user", user: user })
    )
    .catch(err =>
      res
        .status(500)
        .json({ errorMessage: "unable to create user", error: err })
    );
});

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.findUser(username)
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user.id;
        const token = generateToken(user);
        res
          .status(200)
          .json({ message: `successfully logged in as ${username}`, token });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch(err =>
      res.status(500).json({ errorMessage: "unable to login", error: err })
    );
});

server.get("/api/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy(err =>
      err
        ? res.json({ message: "you can never leave" })
        : res.status(200).json({ message: "logout was successful" })
    );
  } else {
    res.status(200).json({ message: "You were never here to start" });
  }
});

server.use("/", (req, res) => {
  res.status(200).send("api is working");
});

module.exports = server;

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "1d"
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "none to stand", options);
}

function restricted(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "you shall not pass" });
  }
}
