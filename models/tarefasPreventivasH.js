const { Sequelize } = require('sequelize');
const db = require('./db');
const PreventivaHidraulica = db.define('tarefasPreventivasHidraulica', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_ordem:{
        type: Sequelize.INTEGER,
    },
    maquina:{
        type: Sequelize.STRING()
    },
    tarefa:{
        type: Sequelize.STRING()
    },
    como:{
        type: Sequelize.STRING()
    },
    material:{
        type: Sequelize.STRING()
    },
    chekLista:{
        type: Sequelize.STRING()
    },
    dataInicio:{
        type: Sequelize.STRING()
    },
    dataFinal:{
        type: Sequelize.STRING()
    }
});
PreventivaHidraulica.sync();
module.exports = PreventivaHidraulica;