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

// 홈에서 HTML 파일을 보여주고 싶다면?
const path = require('path');
app.get('/', (req, res) => {
    // res.send 대신 파일을 보내주면 화면이 바로 떠요!
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 돌아가고 있어요!`);
});