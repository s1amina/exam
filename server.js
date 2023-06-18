// Подключение необходимых модулей и установка переменных
const express = require('express'); // Подключение модуля express
const mongoose = require('mongoose'); // Подключение модуля mongoose для работы с MongoDB
const app = express(); // Создание экземпляра приложения express
const connectToMongoDB = require('./database/connections'); // Подключение функции для соединения с MongoDB
const path = require('path'); // Подключение модуля path для работы с путями файловой системы
const routes = require('./routes/routes'); // Подключение модуля маршрутов приложения
const session = require('express-session'); // Подключение модуля express-session для работы с сессиями
const User = require('./models/users'); // Подключение модуля User из файла ./models/users.js
const MongoDBStore = require('connect-mongodb-session')(session); // Подключение модуля MongoDBStore для хранения сессий в MongoDB
require('dotenv').config(); // Загрузка переменных окружения из файла .env
const bcrypt = require('bcryptjs'); // Подключение модуля bcryptjs для хеширования паролей

// Создание экземпляра MongoDBStore для хранения сессий
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI, // URI подключения к MongoDB из переменной окружения MONGODB_URI
    collection: 'sessions' // Название коллекции для хранения сессий
});

// Использование модуля express-session для работы с сессиями
app.use(session({
    secret: process.env.SECRET_KEY, // Секретный ключ для подписи сессии
    resave: false, // Опция для пересохранения сессии даже если она не изменилась
    saveUninitialized: false, // Опция для сохранения только инициализированных сессий
    store: store // Хранилище сессий
}));

app.use('/css', express.static(__dirname, + '/public/css')); // Подключение статических файлов CSS из папки /public/css

app.set('views', path.join(__dirname, 'views')); // Установка пути для шаблонов EJS
app.set('view engine', 'ejs'); // Установка EJS в качестве движка представлений

app.use(express.urlencoded({ extended: true })); // Использование модуля express для обработки данных формы

app.use('/css', express.static(__dirname + '/public/css')); // Подключение статических файлов CSS из папки /public/css
app.use('/img/avatars', express.static(__dirname + '/public/img/avatars')); // Подключение статических файлов аватаров из папки /public/img/avatars
app.use('/img', express.static(__dirname + '/public/img')); // Подключение статических изображений из папки /public/img
app.use('/uploads', express.static(__dirname + '/public/uploads')); // Подключение статических файлов из папки /public/uploads
app.use('/js', express.static(__dirname + '/public/js')); // Подключение статических файлов JavaScript из папки /public/js

app.use('/', routes); // Использование модуля маршрутов routes для обработки запросов

// Функция для запуска БД и сервера
async function start() {
    const uri = await connectToMongoDB(); // Установка соединения с MongoDB и получение URI подключения
    console.log(uri); // Вывод URI подключения в консоль
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // Подключение к MongoDB с использованием полученного URI
    app.listen(4000, () => {
        console.log('Сервер запущен на порту 3000'); // Запуск сервера на порту 3000
    });
}

start(); // Вызов функции для запуска приложения
