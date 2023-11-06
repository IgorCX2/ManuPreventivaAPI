const Sequelize = require('sequelize');
const QRCode = require('qrcode');
const express = require('express');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
var jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs/dist/bcrypt');
const PreventivaHidraulica = require('../models/tarefasPreventivasH');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, Authorization');
  res.header('x-forwarded-for', '*');
  router.use(cors());
  next();
});
router.post('/pegardados-hidraulico', async (req, res) => {
    console.log(req.body);
    const buscarDados = await PreventivaHidraulica.findAll({
        where: {
            id_ordem: req.body.cod,
        },
    });
    return res.json({
        buscarDados
    });
});
router.post('/reporte-hidraulico', async (req, res) => {
    console.log(req.body.dados);
    try {
        for (const infos of req.body.dados) {
            await PreventivaHidraulica.update(
                {como: infos.como, material: infos.material, dataInicio: req.body.tempo.dataInicio,  dataFinal: req.body.tempo.dataFinal},
                { where: { id: infos.id} }
            )
        }
        return res.status(200).json({
            mensage: "Sucesso!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Ocorreu um erro ao salvar as ordens de preventiva hidráulica.',
            error: error.message,
        });
    }
});
module.exports = router;
