// Импорт модуля express, который используется для создания серверных приложений
const express = require('express');

// Создание экземпляра маршрутизатора, который будет обрабатывать маршруты
const router = express.Router();

// Импорт модели News
const News = require('../models/newsModel');

// Импорт модуля multer, который используется для загрузки файлов
const multer = require('multer');

// Импорт модуля uuidv4 из библиотеки uuid для генерации уникальных идентификаторов
const { v4: uuidv4 } = require('uuid');

// Импорт модуля path для работы с путями файловой системы
const path = require('path');

// Роут для отображения страницы редактирования новости по ее идентификатору
router.get('/:id', async (req, res) => {
  // Получение идентификатора новости из параметров запроса
  const { id } = req.params;
  try {
    // Поиск новости по идентификатору в базе данных
    const news = await News.findById(id);
    // Отображение шаблона "editnews" с данными найденной новости
    res.render('editnews', { news, session: req.session });
  } catch (err) {
    // Перенаправление на страницу всех новостей в случае ошибки
    res.redirect('/allnews');
  }
});

// Хранилище для загруженных изображений
const storage = multer.diskStorage({
  // Определение папки назначения для сохранения загруженных изображений
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  // Генерация уникального имени файла на основе идентификатора поля и текущего времени
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + Date.now() + ext;
    cb(null, filename);
  }
});

// Создание объекта middleware с настройками multer
const upload = multer({
  // Использование определенного хранилища для загруженных файлов
  storage: storage,
  // Фильтрация файлов по типу (разрешены только jpeg, jpg и png)
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      // Принятие файла для загрузки
      return cb(null, true);
    } else {
      // Отклонение файла с ошибкой, если его тип не соответствует разрешенным типам
      cb('Error: Images only!');
    }
  }
});

// Роут для обновления новости по ее идентификатору
router.post('/:id', upload.single('poster'), async (req, res) => {
  // Получение идентификатора новости из параметров запроса
  const { id } = req.params;
  // Получение данных новости из тела запроса
  const { title, category, description } = req.body;

  try {
    // Поиск новости по идентификатору в базе данных
    const news = await News.findById(id);

    if (!news) {
      // Перенаправление на страницу всех новостей, если новость не найдена
      return res.redirect('/allnews');
    }

    // Обновление полей новости с полученными данными
    news.title = title;
    news.category = category;
    news.description = description;

    if (req.file) {
      // Обновление поля "poster" новости с именем загруженного файла
      news.poster = req.file.filename;
    }

    // Сохранение изменений новости в базе данных
    await news.save();
    // Перенаправление на страницу всех новостей после успешного обновления
    res.redirect(`/allnews`);
  } catch (err) {
    // Перенаправление на страницу всех новостей в случае ошибки
    res.redirect('/allnews');
  }
});

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;
