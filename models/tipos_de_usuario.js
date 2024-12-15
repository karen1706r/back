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
    nombre_tipo: {
      type: DataTypes.CHAR(50),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "nombre_tipo",
      autoIncrement: false
    }
  };
  const options = {
    tableName: "tipos_de_usuario",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const TiposDeUsuarioModel = sequelize.define("tipos_de_usuario_model", attributes, options);

  TiposDeUsuarioModel.associate = function (models) {

    TiposDeUsuarioModel.hasMany(models.usuarios_model, {
      foreignKey: 'id_tipo_usuario'
    });


  };

  return TiposDeUsuarioModel;
};