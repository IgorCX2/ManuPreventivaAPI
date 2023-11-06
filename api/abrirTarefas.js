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
router.post('/hidraulico', async (req, res) => {
    console.log(req.body);
    try {
        const verificarUltimaOrdem = await PreventivaHidraulica.findOne({
            attributes: [[Sequelize.fn('MAX', Sequelize.col('id_ordem')), 'maxIdOrdem']],
            raw: true,
        });
        const valorOrdem = verificarUltimaOrdem ? verificarUltimaOrdem.maxIdOrdem : 0;
        const url = `http://localhost:3000/reporte/${req.body.tipo}/${valorOrdem}`;
        for (const tarefa of req.body.tarefas) {
            if (tarefa.valor) {
                await PreventivaHidraulica.create({
                    id_ordem: valorOrdem + 1,
                    tarefa: tarefa.valor,
                    maquina: req.body.maquina,
                });
            }
        }
        const qrCodeDataUrl = await QRCode.toDataURL(url);
        return res.status(200).json({
            qrCode: qrCodeDataUrl,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Ocorreu um erro ao criar as ordens de preventiva hidráulica.',
            error: error.message,
        });
    }
});

module.exports = router;
