const db = require("./walmart-config");

module.exports = {
  find,
  findById,
  findUser,
  insert
};

function find() {
  return db("Employees");
}

function findById(id) {
  return db("Employees")
    .first()
    .where({ id });
}

function findUser(username) {
  return db("Employees")
    .first()
    .where({ username });
}

function insert(user) {
  return db("Employees").insert(user);
}
