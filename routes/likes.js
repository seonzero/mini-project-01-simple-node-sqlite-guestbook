const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. 좋아요 추가하기 POST / api / likes
router.post('/', (req, res) => {
    const { user_id, message_id } = req.body;

    if (!user_id || !message_id) {
        return res.status(400).json({ error: 'user_id와 message_id는 필수입니다.' });
    }

    db.run(
        `INSERT INTO likes (user_id, message_id) VALUES (?, ?)`,
        [user_id, message_id],
        function(err) {
            if (err) {
                // UNIQUE 제약 위반 = 이미 좋아요 누른 상태
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({ error: '이미 좋아요를 눌렀습니다.' });
                }
                return res.status(500).json({ error: '서버 오류' });
            }
            res.status(201).json({ message: '좋아요!' });
        }
    );
});

// 2. 좋아요 취소 DELETE/api/likes
router.delete('/', (req, res) => {
    const { user_id, message_id } = req.body;

    db.run(
        `DELETE FROM likes WHERE user_id = ? AND message_id = ?`,
        [user_id, message_id],
        function(err) {
            if (err) return res.status(500).json({ error: '서버 오류' });
            if (this.changes === 0) return res.status(404).json({ error: '좋아요 기록이 없습니다.' });
            res.json({ message: '좋아요 취소!' });
        }
    );
});


// 3. 특정 메시지 좋아요 수 조회 GET/api/likes/:message_id
router.get('/:message_id', (req, res) => {
    const { message_id } = req.params;

    db.get(
        `SELECT COUNT(*) as like_count FROM likes WHERE message_id = ?`,
        [message_id],
        (err, row) => {
            if (err) return res.status(500).json({ error: '서버 오류' });
            res.json(row);
        }
    );
});

module.exports = router;
