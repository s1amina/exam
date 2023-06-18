const mongoose = require('mongoose');

// Определение схемы новостей
const newsSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Заголовок новости
    category: { type: String, required: true }, // Категория новости
    description: { type: String, required: true }, // Описание новости
    poster: { type: String, required: true }, // Постер/изображение новости
    createdAt: { type: Date, default: Date.now }, // Дата создания новости (по умолчанию - текущая дата)
    postId: { type: String, required: true, unique: true } // Идентификатор новости (уникальное значение)
});

// Создание модели новостей
const News = mongoose.model('News', newsSchema);

module.exports = News; // Экспорт модели News для использования в других модулях
