const express = require('express');
const router = express.Router();
const db = require('../db');


// 1. 글쓰기 POST / api/messages
router.post('/', (req, res) =>{
    const {user_id, content } = req.body;

    if (!user_id || !content) {
        return res.status(400).json({error: 'user_id와 content는 필수입니다.'});
    }

    db.run(
        `INSERT INTO messages (user_id, content) VALUES (?, ?)`,
        [user_id, content],
        function(err) {
            if (err) return res.status(500).json({error: '서버 오류'});
            res.status(201).json({
                message: '글 작성 완료',
                messageId: this.lastID
            });
        }
    );
});


// 2. 전체 목록 GET/api/messages
// deleted_at IS NULL
// JOIN으로 username도 같이 가져오기
router.get('/', (req, res) => {
    db.all(
        `SELECT messages.id, users.username, messages.content, messages.created_at
        FROM messages
        JOIN users ON messages.user_id = users.id
        WHERE messages.deleted_at IS NULL
        ORDER BY messages.created_at DESC`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({error: '서버 오류'});
            res.json(rows);
        }
    );
});


// 3. 특정 사용자 글 목록 GET/api/messages?user_id = 1
router.get('/user/:user_id', (req, res) => {
    const {user_id} = req.params;
    db.all(
        `SELECT messages.id, users.username, messages.content, messages.created_at
        FROM messages
        JOIN users ON messages.user_id = users.id
        WHERE messages.user_id =? AND messages.deleted_at IS NULL
        ORDER BY messages.created_at DESC`,
        [user_id],
        (err, rows) => {
            if (err) return res.status(500).json({error: '서버 오류'});
            res.json(rows);
        }
    );
});


// 4. 삭제 DELETE / api/messages/:id?hard=true
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const isHard = req.query.hard === 'true'; //?hard=true면 하드삭제

    if (isHard) {
        //하드 삭제: 행 자체를 제거함 - DELETE 
        db.run(`DELETE FROM messages WHERE id=?`, [id], function(err) {
            if (err) return res.status(500).json({error: '서버 오류'});
            if (this.changes === 0) return res.status(404).json({error: '존재하지 않는 글입니다.'});
            res.json({message: '하드 삭제 완료'});
        });
    } else{
        //소프트 삭제: deleted_at에 현재 시간 기록 - UPDATE
        db.run(
            `UPDATE messages SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [id],
            function(err) {
                if (err) return res.status(500).json({error: '서버 오류'});
                if (this.changes === 0) return res.status(404).json({error: '존재하지 않는 글입니다.'});
                res.json({message: '소프트 삭제 완료!'});
            }
        );
    }
});

module.exports = router;