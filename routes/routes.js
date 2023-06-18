// Импорт модуля express
const express = require('express');
const router = express.Router();

// Импорт маршрутов
const dashboardRoutes = require('./dashboardRoutes');
const indexRoutes = require('./indexRoutes');
const loginRoutes = require('./loginRoutes');
const logoutRoutes = require('./logoutRoutes');
const registerRoutes = require('./registerRoutes');
const addNewsRoutes = require('./addNewsRoutes');
const allnewsRoutes = require('./alllnewsRoutes');
const editRoutes = require('./editRoutes');
const editAllroutes = require('./ediaallRoutes');
const deleteRoutes = require('./deletteRoutes');

// Использование маршрутов
router.use('/', indexRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/register', registerRoutes);
router.use('/dashboard', addNewsRoutes);
router.use('/allnews', allnewsRoutes);
router.use('/edit', editRoutes);
router.use('/editall', editAllroutes);
router.use('/', deleteRoutes);

// Экспорт маршрутизатора для использования в других модулях
module.exports = router;
