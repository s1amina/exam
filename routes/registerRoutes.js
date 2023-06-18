// Импорт модуля express
const express = require('express');
const router = express.Router();

// Импорт контроллера registerController
const registerController = require('../controllers/registerController');

// Роут для отображения страницы регистрации
router.get('/', (req, res) => {
    res.render('register');
});

// Роут для обработки POST-запроса регистрации
router.post('/', registerController.register);

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;
