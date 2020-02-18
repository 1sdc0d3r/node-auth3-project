exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("Employees")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("Employees").insert([
        { username: "Jack", password: "password", department: "Shipping" },
        { username: "Sherry", password: "password", department: "Cashier" },
        { username: "Richard", password: "password", department: "Admin" }
      ]);
    });
};
