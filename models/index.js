'use strict';
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/db.config.json')[env];

const Models = {};

let sequelize = new Sequelize({ dialect: "mysql" });

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
fs
  .readdirSync(__dirname, { withFileTypes: true })
  .forEach(path_url => {
    if (path_url.isDirectory()) {
      fs.readdirSync(`${__dirname}/${path_url.name}`)
        .filter(file => {
          return (file.indexOf('.') !== 0) && (file !== basename) &&
            (file.slice(-3) === '.js');
        })
        .forEach(file => {
          const model = require(path.join(`${__dirname}/${path_url.name}`, file))(sequelize,
            DataTypes);
          Models[model.name] = model;
        });
    } else if ((path_url.name.indexOf('.') !== 0) && (path_url.name !== basename) && (path_url.name.slice(-3) === '.js')) {
      const model = require(path.join(__dirname, path_url.name))(sequelize, DataTypes)
      Models[model.name] = model
    }
  })

Object.keys(Models).forEach(modelName => {
  if (Models[modelName].associate) {
    Models[modelName].associate(Models);
  }
});

module.exports = { db: sequelize, models: Models };