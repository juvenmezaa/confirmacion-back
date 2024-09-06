const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Invitados = sequelize.define("invitados", {
    celular: {
        type: DataTypes.TEXT,
        primaryKey: true,
        comment: "10 caracteres",
    },
    nombre: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    pases: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    confirmados: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},
    {
        timestamps: false,
        freezeTableName: true,
        tableName: "invitados",
    });


module.exports = Invitados;