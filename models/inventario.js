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
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "cantidad",
      autoIncrement: false
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "fecha_ingreso",
      autoIncrement: false
    },
    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "fecha_vencimiento",
      autoIncrement: false
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
        model: "categorias_inventario_model"
      }
    },
    id_ingrediente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "id_ingrediente",
      autoIncrement: false,
      references: {
        key: "id",
        model: "ingredientes_model"
      }
    }
  };
  const options = {
    tableName: "inventario",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const InventarioModel = sequelize.define("inventario_model", attributes, options);

  InventarioModel.associate = function (models) {

    InventarioModel.belongsTo(models.categorias_inventario_model, {
      foreignKey: 'id_categoria'
    });
    InventarioModel.belongsTo(models.ingredientes_model, {
      foreignKey: 'id_ingrediente'
    });


  };

  return InventarioModel;
};