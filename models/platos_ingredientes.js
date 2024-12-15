const {
  DataTypes
} = require('sequelize');
module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "id",
      autoIncrement: true
    },
    id_plato: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "id_plato",
      autoIncrement: false,
      references: {
        key: "id",
        model: "platos_model"
      }
    },
    id_ingredientes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "id_ingredientes",
      autoIncrement: false,
      references: {
        key: "id",
        model: "ingredientes_model"
      }
    },
    cantidad: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "cantidad",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "platos_ingredientes",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };

  const PlatosIngredientesModel = sequelize.define("platos_ingredientes_model", attributes, options);

  PlatosIngredientesModel.associate = function (models) {

    PlatosIngredientesModel.belongsTo(models.platos_model, {
      foreignKey: 'id_plato'
    });

    PlatosIngredientesModel.belongsTo(models.ingredientes_model, {
      foreignKey: 'id_ingredientes'
    });

  };

  return PlatosIngredientesModel;
};
