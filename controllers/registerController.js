// Регистрация пользователя
const bcrypt = require('bcryptjs'); // Подключение модуля для хеширования пароля
const User = require('../models/users'); // Подключение модели пользователя

async function register(req, res) {
    const { email, password } = req.body; // Получение email и password из запроса

    // Проверка заполнения полей email и password
    if (!email || !password) {
        return res.status(400).send('Введите email и пароль');
    }

    // Проверка, что пользователь с таким email не уже зарегистрирован
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send('Пользователь с таким email уже зарегистрирован');
    }

    // Хеширование пароля
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Создание нового пользователя
    const user = new User({
        email,
        password: hashedPassword,
    });

    // Сохранение нового пользователя в базе данных
    try {
        await user.save();
        res.send('Вы успешно зарегистрировались');
    } catch (err) {
        res.status(500).send('Ошибка при сохранении пользователя в базе данных');
    }
}

module.exports = {
    register
};
