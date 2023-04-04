const { Sequelize, DataTypes, Model, ModelStatic } = require("sequelize")

/**
 * 
 * @param {Sequelize} sequelize 
 * @param {DataTypes} DataTypes 
 * @returns 
 */
module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Student', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "School-Student",
  })

  /**
   * 
   * @param {{ [key: string] : ModelStatic<Model>}} models 
   */
  sequelize.models
  model.associate = (models) => {
    model.hasMany(models["Math"], {
      foreignKey: {
        name: "StudentId",
        allowNull: false
      }
    })
    model.hasMany(models["Programming"], {
      foreignKey: {
        name: "StudentId",
        allowNull: false
      }
    })
  }

  return model
}