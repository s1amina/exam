// Импорт модуля express
const express = require('express');
const router = express.Router();

// Импорт контроллера logoutController
const logoutController = require('../controllers/logoutController');

// Роут для выхода пользователя (выход из сеанса)
router.get('/', logoutController.logout);

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;
