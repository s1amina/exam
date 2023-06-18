// Импорт модуля express, который используется для создания серверных приложений
const express = require('express');

// Создание экземпляра маршрутизатора, который будет обрабатывать маршруты
const router = express.Router();

// Импорт middleware для аутентификации
const authMiddleware = require('../middlewares/authMiddleware');

// Импорт модели UserDetails и User
const UserDetails = require('../models/UserDetails');
const User = require('../models/users');

// Импорт модуля multer для обработки загрузки файлов
const multer = require('multer');
const path = require('path');

// Импорт модуля querystring для эскейпинга (экранирования) символов
const { escape } = require('querystring');

// Импорт модуля fs для работы с файловой системой
const fs = require('fs');

// Функция проверки аутентификации
function checkAuth(req, res, next) {
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'user')) {
        return res.redirect('/login');
    }
    next();
}

// Обработчик GET-запроса для корневого маршрута
router.get('/', (req, res) => {
    // Логика обработки GET-запроса для страницы "dashboard"
    // Возвращаем нужный HTML-шаблон или выполняем необходимые действия
    res.render('dashboard', { session: req.session });
});

// Обработчик GET-запроса для страницы "user-data"
router.get('/user-data', checkAuth, async (req, res) => {
    let userDetails = await UserDetails.findOne({ user: req.session.user._id });
    if (!userDetails) {
        userDetails = new UserDetails({
            user: req.session.user._id,
            nickname: '',
            about: '',
            avatarUrl: ''
        });
        await userDetails.save();
    }
    res.render('userDataForm', { session: req.session, userDetails: userDetails });
});

// Обработчик GET-запроса для страницы "profile/:id"
router.get('/profile/:id', checkAuth, async (req, res) => {
    const userDetails = await UserDetails.findOne({ user: req.params.id }).populate('user');
    if (!userDetails) {
        return res.redirect('/dashboard');
    }
    res.render('userProfile', { session: req.session, userDetails });
});


// Хранилище для загруженных изображений
// Создаем хранилище для загруженных изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/avatars');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + ext;
        cb(null, filename);
    }
});

// Создание объекта middleware с настройками multer
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
}).single('avatar');

// Обработчик POST-запроса для страницы "user-data"
router.post('/user-data', checkAuth, async (req, res) => {
    // Обрабатываем загруженный файл
    upload(req, res, async (err) => {
        if (err) {
            return res.render('userDataForm', { session: req.session, error: err });
        }

        // Объявляем переменную userDetails
        let userDetails;

        // Ищем запись о пользователе
        userDetails = await UserDetails.findOne({ user: req.session.user._id });

        // Если запись уже существует, то обновляем ее поля
        if (userDetails) {
            userDetails.nickname = req.body.nickname;
            userDetails.about = req.body.about;

            // Проверяем, был ли загружен новый файл
            if (req.file) {
                const oldAvatarPath = userDetails.avatarUrl ? path.join(__dirname, '..', 'public', userDetails.avatarUrl) : null;
                userDetails.avatarUrl = '/img/avatars/' + req.file.filename;

                // Удаляем старый файл, если он есть
                if (oldAvatarPath && fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath);
                }
            }

            await userDetails.save();
        } else {
            // Если записи не существует, то создаем ее
            userDetails = new UserDetails({
                user: req.body.user,
                nickname: req.body.nickname,
                about: req.body.about,
                avatarUrl: req.file ? '/img/avatars/' + req.file.filename : null,
                user: req.session.user._id,
            });
            await userDetails.save();
        }

        // Перенаправляем пользователя на страницу с данными всех пользователей
        res.redirect('/dashboard');
    });
});

// Обработчик POST-запроса для страницы "profile/:id/delete-avatar"
router.post('/profile/:id/delete-avatar', async (req, res) => {
    const userDetails = await UserDetails.findOne({ user: req.params.id });
    if (!userDetails) {
        return res.redirect('/dashboard');
    }
    if (userDetails.avatarUrl) {
        const filePath = path.join(__dirname, '..', 'public', userDetails.avatarUrl);
    }
    userDetails.avatarUrl = null;
    await userDetails.save();
    res.redirect(`/dashboard/profile/${req.params.id}`);
});

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;
