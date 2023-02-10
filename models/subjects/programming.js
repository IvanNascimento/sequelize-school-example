module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('Programming', {
    grade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: "Subjects-Programming",
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