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
    nombre: {
      type: DataTypes.CHAR(100),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "nombre",
      autoIncrement: false
    },
    unidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "unidad",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "ingredientes",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const IngredientesModel = sequelize.define("ingredientes_model", attributes, options);

  IngredientesModel.associate = function (models) {

    IngredientesModel.hasMany(models.platos_ingredientes_model, {
      foreignKey: 'id_ingredientes'
    });

    IngredientesModel.hasMany(models.inventario_model, {
      foreignKey: 'id_ingrediente'
    });


  };
  return IngredientesModel;
};