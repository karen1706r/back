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
    hora: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "hora",
      autoIncrement: false
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
    }
  };
  const options = {
    tableName: "sesiones_usuarios",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const SesionesUsuariosModel = sequelize.define("sesiones_usuarios_model", attributes, options);

  SesionesUsuariosModel.associate = function (models) {

    SesionesUsuariosModel.belongsTo(models.usuarios_model, {
      foreignKey: 'id_usuario'
    });

  };
  return SesionesUsuariosModel;
};