// Функция выхода пользователя и закрытие сессии
async function logout(req, res) {
    req.session.destroy(function(err) { // Уничтожение сессии
        if (err) {
            console.log(err); // Вывод ошибки, если она возникла
        } else {
            res.redirect('./login'); // Перенаправление на страницу входа
        }
    });
}

module.exports = {
    logout
};
