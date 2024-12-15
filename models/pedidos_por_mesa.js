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
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "cantidad",
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
        model: "categorias_platos_model"
      }
    },
    comentarios: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "comentarios",
      autoIncrement: false
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "fecha_hora",
      autoIncrement: false
    },

  };
  const options = {
    tableName: "pedidos_por_mesa",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };


  const PedidosPorMesaModel = sequelize.define("pedidos_por_mesa_model", attributes, options);

  PedidosPorMesaModel.associate = function (models) {


    PedidosPorMesaModel.belongsTo(models.pedidos_model, {
      foreignKey: 'id_pedido'
    });

    PedidosPorMesaModel.belongsTo(models.platos_model, {
      foreignKey: 'id_plato'
    });


    PedidosPorMesaModel.belongsTo(models.categorias_platos_model, {
      foreignKey: 'id_categoria'
    });

  };
  return PedidosPorMesaModel;
};
