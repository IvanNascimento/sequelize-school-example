module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Student', {
    grade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "School-Student",
  })

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