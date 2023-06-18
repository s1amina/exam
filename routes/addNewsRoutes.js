// Импорт модуля express, который используется для создания серверных приложений
const express = require('express');

// Создание экземпляра маршрутизатора, который будет обрабатывать маршруты
const router = express.Router();

// Импорт модели newsModel, представляющей схему новостей в базе данных
const News = require('../models/newsModel');

// Импорт модуля multer, который обеспечивает обработку загрузки файлов
const multer = require('multer');

// Импорт функции uuidv4 из модуля uuid, используемой для создания уникальных идентификаторов
const { v4: uuidv4 } = require('uuid');

// Импорт модуля bcryptjs для хеширования паролей
const bcrypt = require('bcryptjs');

// Импорт модуля path, используемого для работы с путями файловой системы
const path = require('path');

// Обработчик GET-запроса для страницы добавления новости
router.get('/add-news', async (req, res) => {
    res.render('add-news', { session: req.session });
});

// Хранилище для загруженных изображений, указывается путь назначения для сохранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    // Определение имени файла, используя оригинальное имя файла, текущую дату и расширение файла
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + ext;
        cb(null, filename);
    }
});

// Создание объекта middleware с настройками multer для обработки загрузки файлов
const upload = multer({
    storage: storage,
    // Фильтрация файлов только с расширениями jpeg, jpg и png
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            // Файл соответствует требованиям
            return cb(null, true);
        } else {
            // Файл не соответствует требованиям
            cb('Error: Images only!');
        }
    }
});

// Обработчик POST-запроса для добавления новости, используется middleware upload.single('poster') для загрузки одного файла с именем 'poster'
router.post('/add-news', upload.single('poster'), async (req, res) => {
    // Извлечение данных из тела запроса
    const { title, category, description } = req.body;

    // Получение имени загруженного файла
    const poster = req.file.filename;

    try {
        // Получение количества документов в коллекции новостей
        const count = await News.countDocuments();

        // Генерация идентификатора для новости
        const postId = `post${count + 1}`;

        // Создание новой записи новости
        const news = new News({ title, category, description, poster, postId });

        // Сохранение новости в базе данных
        await news.save();

        // Вывод информации о сохраненной новости в консоль
        console.log(news);

        // Перенаправление пользователя на страницу новости с использованием идентификатора
        res.redirect(`/news/${postId}`);
    } catch (err) {
        // Отправка ошибки клиенту в случае возникновения ошибки при сохранении новости
        res.send(err);
        // Редирект пользователя на страницу добавления новости в случае ошибки
        // res.redirect('/add-news');
    }
});

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;
