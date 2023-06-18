// Импорт модуля express, который используется для создания серверных приложений
const express = require('express');

// Создание экземпляра маршрутизатора, который будет обрабатывать маршруты
const router = express.Router();

// Импорт модели News
const News = require('../models/newsModel');

// Обработчик POST-запроса для удаления новости
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const news = await News.findByIdAndDelete(id);
        if (!news) {
            return res.redirect('/editall');
        }
        res.redirect('/editall');
    } catch (err) {
        res.redirect('/editall');
    }
});

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;
