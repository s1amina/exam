// Импорт модуля express, который используется для создания серверных приложений
const express = require('express');

// Создание экземпляра маршрутизатора, который будет обрабатывать маршруты
const router = express.Router();

// Импорт модели News
const News = require('../models/newsModel');

// Роут для отображения списка всех новостей
router.get('/', async (req, res) => {
    try {
        const news = await News.find();
        res.render('edit', { news, session: req.session });
    } catch (err) {
        res.redirect('/allnews');
    }
});

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;
