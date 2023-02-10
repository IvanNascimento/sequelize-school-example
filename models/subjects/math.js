module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Math', {
    grade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "Subjects-Math",
  })

  model.associate = (models) => {
    model.belongsTo(models["Student"], {
      foreignKey: {
        name: "StudentId",
        allowNull: false
      }
    })
  }

  return model
}