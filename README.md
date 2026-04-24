# 📝 디지털 방명록 v2.0

```markdown
feat/advanced-api 브랜치
│
├── ✅ [1] 브랜치 생성 & 파일 구조 분리
│        db.js, routes/ 폴더 분리
│
├── ✅ [2] DB 재설계
│        users, messages(deleted_at), likes 테이블
│
├── ✅ [3] 사용자 API
│        POST /api/users
│        GET  /api/users/:id
│
├── ✅ [4] 메시지 API (user_id 기반)
│        POST /api/messages
│        GET  /api/messages
│        GET  /api/messages/user/:user_id
│
├── ✅ [5] 소프트/하드 삭제
│        DELETE /api/messages/:id
│        DELETE /api/messages/:id?hard=true
│
├── ✅ [6] 좋아요 API
│        POST   /api/likes
│        DELETE /api/likes
│        GET    /api/likes/:message_id
│
└── ✅ [7] Docker 컨테이너화  
```



## 프로젝트 개요

Express + SQLite 기반 방명록 프로젝트.
v1에서 단순 방명록 기능을 넘어, 실무에서 사용하는 구조로 개선했습니다.


## v1 → v2 개선사항

### 1. 파일 구조 분리

```
# v1: 모든 코드가 index.js 하나에
index.js  ← DB연결 + API 전부

# v2: 역할별로 분리
index.js        ← 서버 시작점
db.js           ← DB 연결 관리
routes/
  users.js      ← 사용자 API
  messages.js   ← 메시지 API
  likes.js      ← 좋아요 API
```

### 2. DB 구조 개선

```
# v1: 이름을 텍스트로 저장
messages: id | name(text) | content

# v2: 사용자 테이블 분리 + 관계 설정
users:    id | username | created_at
messages: id | user_id(FK) | content | created_at | deleted_at
likes:    id | user_id(FK) | message_id(FK) | created_at
```

### 3. 소프트 삭제 도입

```
# v1: 하드 삭제만 존재
DELETE FROM messages WHERE id = ?  → 영구 삭제

# v2: 소프트/하드 삭제 선택 가능
소프트: deleted_at에 시간 기록 → 복구 가능
하드:   행 자체 삭제 → 복구 불가

DELETE /api/messages/:id           → 소프트 삭제
DELETE /api/messages/:id?hard=true → 하드 삭제
```

### 4. 좋아요 기능 (다대다 관계)

```
# likes 테이블이 users ↔ messages를 연결
UNIQUE(user_id, message_id) → 중복 좋아요 방지
```

---

## API 명세서

### Users

| Method | Path | 설명 |
| --- | --- | --- |
| POST | `/api/users` | 사용자 등록 |
| GET | `/api/users/:id` | 사용자 조회 |
| POST | `/api/users/findOrCreate` | username으로 찾거나 자동 생성 |

### Messages

| Method | Path | 설명 |
| --- | --- | --- |
| POST | `/api/messages` | 글 작성 |
| GET | `/api/messages` | 전체 글 목록 (삭제된 것 제외) |
| GET | `/api/messages/user/:user_id` | 특정 유저 글 목록 |
| DELETE | `/api/messages/:id` | 소프트 삭제 |
| DELETE | `/api/messages/:id?hard=true` | 하드 삭제 |

### Likes

| Method | Path | 설명 |
| --- | --- | --- |
| POST | `/api/likes` | 좋아요 추가 |
| DELETE | `/api/likes` | 좋아요 취소 |
| GET | `/api/likes/:message_id` | 좋아요 수 조회 |

---

## 배운 개념

[배운 개념](learning_note.md)

- **관계형 DB 설계**: FK로 테이블 간 관계 설정
- **소프트/하드 삭제**: `deleted_at` 패턴
- **다대다(M:N) 관계**: 중간 테이블(likes)로 연결
- **Docker**: 컨테이너화로 환경 독립적 실행
- **라우터 분리**: 역할별 파일 구조



## 트러블슈팅

### 1. 개요 (Intro)

- **프로젝트명**: Node.js + SQLite 기반의 디지털 방명록 도커라이징(Dockerizing)
- **활동 동기**: 로컬 환경(`node index.js`)에서만 돌아가던 서버를, "어떤 환경에서도 똑같이 돌아가는" 컨테이너 환경(Docker)으로 옮기는 과정을 실습함.
- **핵심 키워드**: Docker, Node.js, SQLite3, Native Modules, Troubleshooting.

---

### 2. 활동 의미 (The Why)

왜 이 고생을 해서 도커를 썼을까요?

1. **환경 격리**: 내 컴퓨터의 설정(Windows)과 서버의 설정(Linux)이 충돌하는 문제를 방지함.
2. **모듈화**: `index.js` 하나에 몰려있던 코드들을 `routes/` 폴더로 나누어 관리하기 편하게 만듦.
3. **이식성**: 이제 `Dockerfile`만 있으면 다른 사람의 컴퓨터에서도 `npm install` 없이 즉시 실행 가능함.

---

### 3. 주요 활동 단계 (The How)

#### Step 1: 코드의 구조화 (Routes 분리)

덩치가 커진 서버를 기능별로 쪼갰습니다.

- `routes/users.js`: 사용자 등록 및 찾기 (`findOrCreate`)
- `routes/messages.js`: 방명록 글쓰기, 목록 불러오기, 삭제
- `routes/likes.js`: 좋아요 기능
- **주의**: 분리한 뒤 반드시 `index.js`에서 `app.use('/api/...', router)`로 길(Router)을 연결해줘야 함! (우리가 빼먹어서 고생했던 부분 😉)

#### Step 2: 도커 환경 구축 (Dockerfile 작성)

가장 큰 고비였던 **네이티브 모듈(`sqlite3`)** 문제를 해결한 최종 레시피입니다.

- **문제**: `sqlite3`는 설치 시 OS에 맞는 바이너리를 쓰는데, 도커 안과 밖의 버전(`GLIBC`)이 달라서 에러 발생.
- **해결**: 도커 안에서 직접 '요리(Compile)'하도록 설정함.
    - `apt-get install -y python3 make g++`: 요리 도구 설치.
    - `npm install --build-from-source`: 남이 만든 거 쓰지 말고 여기서 직접 빌드해!

#### Step 3: 깨끗한 빌드를 위한 청소

- **중요**: 로컬의 `node_modules`가 도커 안으로 복사되지 않게 삭제하고, `.dockerignore`를 철저히 관리함.Bash
    
    `rm -rf node_modules
    docker build --no-cache -t guestbook-app .`
    

#### Step 4: 컨테이너 실행 및 내부 검증


권장 실행 프로세스

**빌드**: `docker build -t guestbook-app .` (수정 사항 반영)

**기존 컨테이너 정리**: `docker rm -f my-guestbook` (이름 충돌 방지)

**실행**: `docker run -p 3000:3000 --name my-guestbook --rm guestbook-app`

---

도커라는 가상 세계 안으로 들어가서 데이터가 잘 들어갔는지 눈으로 확인했습니다.

1. **컨테이너 접속**: `docker exec -it <컨테이너이름> //bin/bash` (Git Bash 경로 오류 방지를 위해 `/` 하나 더 추가!)
2. **도구 설치**: `apt-get update && apt-get install -y sqlite3`
3. **DB 확인**: `sqlite3 guestbook.db` -> `SELECT * FROM messages;`

---

### 4. 트러블슈팅 (The Lessons)


- **에러**: `GLIBC_2.38 not found`
- **원인**: 미리 빌드된 `sqlite3` 바이너리와 도커 내부 OS의 라이브러리 버전 불일치.
- **교훈**: 네이티브 모듈을 사용할 때는 베이스 이미지의 OS 버전(`bookworm` 등)을 명시하고, 필요시 소스에서 직접 빌드하는 과정이 안전함.



### 5. 마무리 (Conclusion)

- **소감**: 처음엔 에러 메시지만 보고 막막했지만, 하나씩 뜯어보니 결국 "환경의 차이"를 이해하는 과정이었습니다.
- **다음 목표**: 현재는 도커를 끄면 데이터가 사라지는 구조인데, 다음에는 **Docker Volume**을 공부해서 데이터를 영구적으로 보관하는 법을 적용해보고 싶습니다.

