const { Sequelize, DataTypes, Model, ModelStatic } = require("sequelize")
const { TABLES, MODELS } = require("../config/constants")

/**
 * 
 * @param {Sequelize} sequelize 
 * @param {DataTypes} DataTypes 
 */
module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(MODELS["Student"], {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enrollment: {
      type: DataTypes.STRING(13),
      allowNull: false,
      unique: true,
      defaultValue: () => {
        let d = new Date()
        let p = d.getMonth() <= 5 ? 1 : 2
        let r = String(Date.now()).slice(-8)
        return `${d.getFullYear()}${p}${r}`
      }
    }
  }, {
    tableName: TABLES["Student"],
  })

  /**
   * 
   * @param {{ [key: string] : ModelStatic<Model>}} models 
   */
  model.associate = (models) => {
    model.hasMany(models[MODELS['Subject']], {
      foreignKey: {
        name: "StudentId",
        allowNull: false
      }
    })
  }

  return model
}