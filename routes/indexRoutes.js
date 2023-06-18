// Импорт модуля express, который используется для создания серверных приложений
const express = require('express');

// Создание экземпляра маршрутизатора, который будет обрабатывать маршруты
const router = express.Router();

// Импорт модели News
const News = require('../models/newsModel');

// Роут для отображения главной страницы
router.get('/', async (req, res) => {
  try {
    // Получение всех новостей из базы данных
    const news = await News.find({});
    console.log(news); // Вывод полученных новостей в консоль
    // Отображение шаблона "index" с данными о новостях и текущей сессии
    res.render('index', { news, session: req.session });
  } catch (err) {
    // Перенаправление на главную страницу в случае ошибки
    res.redirect('/');
  }
});

// Роут для отображения страницы конкретной новости по ее идентификатору
router.get('/news/:postId', async (req, res) => {
  // Получение идентификатора новости из параметров запроса
  const { postId } = req.params;
  try {
    // Поиск новости по идентификатору в базе данных
    const item = await News.findOne({ postId });
    // Отображение шаблона "news" с данными найденной новости и текущей сессией
    res.render('news', { item, session: req.session });
  } catch (err) {
    // Перенаправление на главную страницу в случае ошибки
    res.redirect('/');
  }
});

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;
