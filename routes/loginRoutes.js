// Импорт модулей express и bcryptjs
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Импорт контроллера loginController
const loginController = require('../controllers/loginController');

// Роут для отображения страницы входа (формы входа)
router.get('/', (req, res) => {
  res.render('login');
});

// Роут для обработки POST-запроса на вход (аутентификацию пользователя)
router.post('/', loginController.login);

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;
