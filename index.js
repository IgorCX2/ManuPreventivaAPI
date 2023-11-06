const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(helmet());


const abrirTarefas = require('./api/abrirTarefas');
app.use('/api/abrirTarefas', abrirTarefas);

const reportarTarefas = require('./api/reportarTarefas');
app.use('/api/reportarTarefas', reportarTarefas);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));