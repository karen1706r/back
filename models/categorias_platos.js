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
    tableName: "categorias_platos",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const CategoriasPlatosModel = sequelize.define("categorias_platos_model", attributes, options);

  CategoriasPlatosModel.associate = function (models) {

    CategoriasPlatosModel.hasMany(models.platos_model, {
      foreignKey: 'id_categoria'
    });

    CategoriasPlatosModel.hasMany(models.pedidos_por_mesa_model, {
      foreignKey: 'id_categoria'
    });

  };

  return CategoriasPlatosModel;
};