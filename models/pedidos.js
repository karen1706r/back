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
    id_mesa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "id_mesa",
      autoIncrement: false,
      references: {
        key: "id",
        model: "mesas_model"
      }
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "id_usuario",
      autoIncrement: false,
      references: {
        key: "id",
        model: "usuarios_model"
      }
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "fecha",
      autoIncrement: false
    },
    estado_pedido: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "estado_pedido",
      autoIncrement: false
    },
    estados_p: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "estados_p",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "pedidos",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };

  const PedidosModel = sequelize.define("pedidos_model", attributes, options);

  PedidosModel.associate = function (models) {

    PedidosModel.hasMany(models.facturas_model, {
      foreignKey: 'id_pedido'
    });

    PedidosModel.hasMany(models.pedidos_por_mesa_model, {
      foreignKey: 'id_pedido'
    });

    PedidosModel.belongsTo(models.usuarios_model, {
      foreignKey: 'id_usuario'
    });

    PedidosModel.belongsTo(models.mesas_model, {
      foreignKey: 'id_mesa'
    });

  };

  return PedidosModel;
};
