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
    nombre_completo: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "nombre_completo",
      autoIncrement: false
    },
    cedula: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "cedula",
      autoIncrement: false
    },
    contrasena: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "contrasena",
      autoIncrement: false
    },
    correo: {
      type: DataTypes.CHAR(100),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "correo",
      autoIncrement: false
    },
    telefono: {
      type: DataTypes.CHAR(15),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "telefono",
      autoIncrement: false
    },
    direccion: {
      type: DataTypes.CHAR(255),
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "direccion",
      autoIncrement: false
    },
    id_tipo_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "id_tipo_usuario",
      autoIncrement: false,
      references: {
        key: "id",
        model: "tipos_de_usuario_model"
      }
    }
  };
  const options = {
    tableName: "usuarios",
    comment: "",
    indexes: [],
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    schema: 'public'
  };
  const UsuariosModel = sequelize.define("usuarios_model", attributes, options);

  UsuariosModel.associate = function (models) {

    UsuariosModel.hasMany(models.pedidos_model, {
      foreignKey: 'id_usuario'
    });
    
    UsuariosModel.hasMany(models.sesiones_usuarios_model, {
      foreignKey: 'id_usuario'
    });

    UsuariosModel.belongsTo(models.tipos_de_usuario_model, {
      foreignKey: 'id_tipo_usuario'
    });

  };

  return UsuariosModel;
};