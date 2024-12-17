const express = require('express');
const path = require('path');
const db = require('./config/database.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index.js');
const http = require("http");
const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));


const testDatabaseConnection = async () => {
    try {
        await db.authenticate();
        console.log('Koneksi database berhasil.');
    } catch (error) {
        console.error('Gagal terkoneksi ke database:', error);
    }
};

testDatabaseConnection();

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
