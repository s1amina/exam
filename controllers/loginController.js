// Подключение необходимых модулей
const express = require('express'); // Подключение модуля express для работы с веб-приложением
const mongoose = require('mongoose'); // Подключение модуля mongoose для работы с MongoDB
const app = express(); // Создание экземпляра приложения express
const User = require('../models/users'); // Подключение модуля User из файла ../models/users.js
const bcrypt = require('bcryptjs'); // Подключение модуля bcryptjs для хеширования паролей

// Функция входа в систему
async function login(req, res) {
    const { email, password } = req.body; // Получение данных email и password из тела запроса

    // Проверка заполненности обоих полей
    if (!email || !password) {
        return res.status(400).send('Введите email и пароль');
    }

    // Поиск пользователя по email
    const user = await User.findOne({ email });

    // Проверка подлинности пароля
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send('Неверный email или пароль');
    }

    // Добавление информации об авторизации пользователя в сессию
    req.session.isAuthenticated = true;
    req.session.user = {
        _id: user._id,
        email: user.email,
        role: user.role
    };

    // Перенаправление на главную страницу
    res.redirect('/');
}

module.exports = {
    login
};
