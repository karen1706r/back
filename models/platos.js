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
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "id_categoria",
      autoIncrement: false,
      references: {
        key: "id",
        model: "categorias_platos_model"
      }
    },
    nombre: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "nombre",
      autoIncrement: false
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "precio",
      autoIncrement: false
    },
    ruta: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "ruta",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "platos",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const PlatosModel = sequelize.define("platos_model", attributes, options);

  PlatosModel.associate = function (models) {

    PlatosModel.hasMany(models.pedidos_por_mesa_model, {
      foreignKey: 'id_plato'
    });

    PlatosModel.hasMany(models.platos_ingredientes_model, {
      foreignKey: 'id_plato'
    });

    PlatosModel.belongsTo(models.categorias_platos_model, {
      foreignKey: 'id_categoria'
    });

  };

  return PlatosModel;
};