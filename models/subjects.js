const { Sequelize, DataTypes, Model, ModelStatic } = require("sequelize")
const { SUBJECTS, MODELS, TABLES } = require("../config/constants")

/**
 * 
 * @param {Sequelize} sequelize 
 * @param {DataTypes} DataTypes 
 */
module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define(MODELS['Subject'], {
    name: {
      type: DataTypes.ENUM,
      values: SUBJECTS,
      allowNull: false
    },
    grade: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: TABLES['Subject'],
  })

  /**
   * 
   * @param {{ [key: string] : ModelStatic<Model>}} models 
   */
  sequelize.models
  model.associate = (models) => {
    model.belongsTo(models[MODELS['Student']], {
      foreignKey: {
        name: "StudentId",
        allowNull: false
      }
    })
    model.belongsTo(models[MODELS['Teacher']], {
      foreignKey: {
        name: "TeacherId",
        allowNull: false
      }
    })
  }

  return model
}