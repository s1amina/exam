const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Определение схемы дополнительной информации о пользователе
const userDetailsSchema = new Schema({
    nickname: { type: String }, // Псевдоним пользователя
    avatarUrl: { type: String }, // URL аватара пользователя
    about: { type: String }, // Описание о пользователе
    user: { type: Schema.Types.ObjectId, ref: 'users' } // Ссылка на идентификатор пользователя (связь с моделью 'User')
});

// Создание модели 'UserDetails' на основе схемы userDetailsSchema
module.exports = mongoose.model('UserDetails', userDetailsSchema, 'UserDetails');
