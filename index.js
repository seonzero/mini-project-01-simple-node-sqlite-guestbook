const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); //0. DB 도구 소환
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 1. DB 연결
const db = new sqlite3.Database('./guestbook.db');

// 2. 테이블 생성 (서버 켤 때 한 번 실행)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        content TEXT
    )`);
});

// ============================================================
// ============================================================


// 3. 홈 화면 (테스트용)
app.get('/', (req, res) => {
    res.send('<h1>디지털 방명록 서버가 가동 중입니다!</h1>');
});

// 4. [글 쓰기] API
app.post('/api/guestbook', (req, res) => {
    const { name, content } = req.body;
    const query = `INSERT INTO messages (name, content) VALUES (?, ?)`;
    
    db.run(query, [name, content], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send("서버 저장 오류");
        }
        res.send('DB에 저장 완료!');
    });
});

// 5. [목록 보기] API 
app.get('/api/guestbook', (req, res) => {
    db.all(`SELECT * FROM messages`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("서버 조회 오류");
        }
        res.json(rows); // DB에서 가져온 행(rows)을 그대로 보냅니다.
    });
});

// 6. [삭제] API
app.delete('/api/guestbook/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM messages WHERE id = ?`, id, (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("서버 삭제 오류");
        }
        res.send('DB에서 삭제 완료!');
    });
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 돌아가고 있어요!`);
});