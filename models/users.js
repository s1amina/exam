// Схема пользователя в базе данных
const mongoose = require('mongoose');
const UserDetails = require('./UserDetails');
const Schema = mongoose.Schema;

// Определение схемы пользователя
const userSchema = new Schema({
    email: { type: String, required: true }, // Электронная почта пользователя
    password: { type: String, required: true }, // Пароль пользователя
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Роль пользователя (администратор или обычный пользователь)
    userDetails: { type: Schema.Types.ObjectId, ref: 'UserDetails' } // Ссылка на идентификатор дополнительной информации о пользователе (связь с моделью 'UserDetails')
});

// Создание модели 'users' на основе схемы userSchema
module.exports = mongoose.model('users', userSchema);
