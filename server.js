const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка подключения к базе данных
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // URL подключения к вашей базе данных
    ssl: {
        rejectUnauthorized: false
    }
});

// Настройка middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Обслуживание статических файлов

// Создание таблицы для хранения результатов (если она не существует)
pool.query(`
    CREATE TABLE IF NOT EXISTS poll_results (
        id SERIAL PRIMARY KEY,
        answer VARCHAR(10) NOT NULL,
        count INTEGER DEFAULT 0
    )
`, (err) => {
    if (err) {
        console.error('Ошибка создания таблицы:', err);
    }
});

// Получение данных о голосовании
app.get('/poll', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM poll_results');
        const data = result.rows.reduce((acc, row) => {
            acc[row.answer] = row.count;
            return acc;
        }, { yes: 0, no: 0 });
        res.json(data);
    } catch (err) {
        console.error('Ошибка получения данных:', err);
        res.status(500).send('Ошибка получения данных');
    }
});

// Обработка голосования
app.post('/poll', async (req, res) => {
    const { answer } = req.body;

    try {
        await pool.query('INSERT INTO poll_results (answer, count) VALUES (\$1, 1) ON CONFLICT (answer) DO UPDATE SET count = poll_results.count + 1', [answer]);
        const result = await pool.query('SELECT * FROM poll_results');
        const data = result.rows.reduce((acc, row) => {
            acc[row.answer] = row.count;
            return acc;
        }, { yes: 0, no: 0 });
        res.json(data);
    } catch (err) {
        console.error('Ошибка обновления данных:', err);
        res.status(500).send('Ошибка обновления данных');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});


