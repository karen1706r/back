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
    numero: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "numero",
      autoIncrement: false
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "id_pedido",
      autoIncrement: false,
      references: {
        key: "id",
        model: "pedidos_model"
      }
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "total",
      autoIncrement: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "fecha",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "facturas",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const FacturasModel = sequelize.define("facturas_model", attributes, options);
  
    FacturasModel.associate = function (models) {

    FacturasModel.belongsTo(models.pedidos_model, {
      foreignKey: 'id_pedido'
    });

  };
  
  return FacturasModel;
};