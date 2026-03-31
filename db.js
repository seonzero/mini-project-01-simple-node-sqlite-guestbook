const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./guestbook.db', (err) => {
    if (err) {
        console.error('DB 연결 실패: ', err.message);
    } else {
        console.log('DB 연결 성공!');
    }
});

// 테이블 생성 - 서버 켤 때 한 번 실행
db.serialize(() => {

    //사용자 테이블 <users>
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id  INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    //메시지 테이블 <messages>: user_id로 users와 연결
    db.run(`CREATE TABLE IF NOT EXISTS messages(
        id  INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content    TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        deleted_at DATETIME DEFAULT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`);


    // 좋아요 테이블 (users ↔ messages 중간 테이블)
    db.run(`CREATE TABLE IF NOT EXISTS likes (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id    INTEGER NOT NULL,
        message_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id)    REFERENCES users(id),
        FOREIGN KEY (message_id) REFERENCES messages(id),
        UNIQUE(user_id, message_id)
    )`);

});

module.exports = db;
