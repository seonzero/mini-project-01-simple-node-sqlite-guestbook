const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// 미들웨어
app.use(cors());
app.use(express.json());

// DB 초기화 (테이블 생성)
require('./db');

// 라우터 연결
const usersRouter    = require('./routes/users');
const messagesRouter = require('./routes/messages');
const likesRouter    = require('./routes/likes');

app.use('/api/users',    usersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/likes',    likesRouter);

// 홈
app.get('/', (req, res) => {
    res.send('<h1>방명록 서버 가동 중!</h1>');
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 돌아가고 있어요!`);
});