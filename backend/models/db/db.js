const Sequelize = require("sequelize");
const fs = require("fs");

const connection = new Sequelize(process.env.DATABASE_URL);
const db = {
  models: {},
  sequelize: connection,
};

connection.authenticate().then(() => console.log("Database connected"));

const files = fs.readdirSync(__dirname);
files.forEach((file) => {
  if (file.endsWith(".js") && file !== "db.js") {
    const modelGenerator = require(`./${file}`);
    const model = modelGenerator(connection);
    db.models[model.name] = model;
  }
});

Object.values(db.models).forEach((model) => {
  if (model.associate) {
    model.associate(db.models);
  }
  if (model.addHooks) {
    model.addHooks(db.models);
  }
});

module.exports = db;
