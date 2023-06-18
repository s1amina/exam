// Подключение к MongoDB и возвращение URI подключения
const { MongoClient, ServerApiVersion } = require('mongodb');

async function connectToMongoDB() {
  try {
    const uri = "mongodb+srv://aminamusabekova07:123@cluster0.vsdjbgk.mongodb.net/exam"; // Строка подключения к MongoDB
    const client = new MongoClient(uri, { // Создание нового клиента MongoDB
      serverApi: {
        version: ServerApiVersion.v1, // Использование версии API v1
        strict: true, // Включение строгого режима для проверки запросов
        deprecationErrors: true, // Включение вывода ошибок о устаревших функциях
      }
    });
    await client.connect(); // Установка соединения с MongoDB
    await client.db("admin").command({ ping: 1 }); // Отправка тестового запроса ping
    console.log("Pinged your deployment. You successfully connected to MongoDB!"); // Вывод сообщения об успешном подключении
    return uri; // Возврат URI подключения
  } catch (err) {
    console.error(err); // Вывод ошибки подключения к MongoDB
  }
}

module.exports = connectToMongoDB; // Экспорт функции подключения к MongoDB
