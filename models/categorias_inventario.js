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
    nombre_categoria: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "nombre_categoria",
      autoIncrement: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "estado",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "categorias_inventario",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'

  };

  const CategoriasInventarioModel = sequelize.define("categorias_inventario_model", attributes, options);

  CategoriasInventarioModel.associate = function (models) {

    CategoriasInventarioModel.hasMany(models.inventario_model, {
      foreignKey: 'id_categoria'
    });

  };

  return CategoriasInventarioModel;
};
