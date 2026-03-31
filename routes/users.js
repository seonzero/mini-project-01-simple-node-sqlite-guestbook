const express = require('express');
const router = express.Router();
const db = require('../db'); // db.js 에서 db 객체 가져옴

// 1. 사용자 등록 (POST / api/users)
router.post('/', (req, res) => {
    const {username} = req.body;

    if (!username) {
        return res.status(400).json({error: 'username은 필수입니다.'});
    }

    db.run(
        `INSERT INTO users (username) VALUES (?)`,
        [username], 
        function(err){
            if (err) {
                // UNIQUE 제약 위반: 이미 있는 username
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({error: '이미 존재하는 username입니다.'});
                }
                return res.status(500).json({error: '서버 오류'});
            }
            res.status(201).json({
                message: '사용자 등록 완료!',
                userId: this.lastID //방금 insert된 id
            });
        }
    );
});

// 2. 사용자 조회: GET/api/users/:id
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.get(
        `SELECT * FROM users WHERE id = ?`,
        [id]
        (err, row) => {
            if (err) return res.status(500).json({error: '서버 오류'});
            if (!row) return res.status(404).json({error: '존재하지 않는 사용자입니다.'});
            res.json(row);
        }
    );
});


module.exports = router;