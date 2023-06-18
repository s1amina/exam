const express = require('express');

// Создание экземпляра маршрутизатора, который будет обрабатывать маршруты
const router = express.Router();

// Импорт модели newsModel, представляющей схему новостей в базе данных
const News = require('../models/newsModel');

// Обработчик GET-запроса для корневого маршрута
router.get('/', async (req, res) => {
    try {
        // Получение всех новостей из базы данных и сортировка их по дате создания в обратном порядке
        const news = await News.find({}).sort({ createAt: -1 });

        // Рендеринг шаблона "allnews" и передача данных о новостях и сессии в представление
        res.render('allnews', { news, session: req.session });
    } catch (err) {
        // В случае возникновения ошибки перенаправление пользователя на корневой маршрут
        res.redirect('/');
    }
});

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;





module.exports = router;
