# mini-project-01-simple-node-sqlite-guestbook
API 통신과 데이터베이스 영속성 원리 이해를 위한 Node.js 기반 미니 방명록 프로젝트 

A simple guestbook app to understand Web API communication and SQLite persistence.


> **API 통신과 데이터베이스의 원리를 이해하기 위해 제작한 풀스택 방명록 프로젝트입니다.**

![디지털 방명록](photo\디지털방명록.png)
![SQLite_db](photo\sqlite_db.png)


---

## 1. 프로젝트 소개
- **개발 기간**: 2026.03.27 (약 1일)
- **목표**: 프론트엔드와 백엔드의 통신 구조(HTTP Request/Response)를 이해하고, SQLite를 활용하여 데이터를 영구적으로 저장하는 서버를 구축합니다.

## 2. 시작 가이드
### 요구 사항 (Prerequisites)
- [Node.js](https://nodejs.org/) (LTS version)
- npm (Node Package Manager)

### 설치 및 실행 (Installation)
1. 리포지토리 클론
   ```
   git clone https://github.com/본인계정/my-guestbook.git`
   ```

1. 패키지 설치    `npm install`
    
2. 서버 실행    `node index.js`
    
3. 브라우저에서 `index.html` 열기

## 3. 기술 스택 (Tech Stack)

### Frontend

- HTML5, Vanilla JavaScript

### Backend

- Node.js, Express, CORS

### Database

- SQLite3 (File-based DB)

## 4. 핵심 기능

- **방명록 작성 (Create)**: 이름과 내용을 입력하여 서버에 저장 (POST)
- **방명록 조회 (Read)**: 저장된 전체 목록을 화면에 출력 (GET)
- **방명록 삭제 (Delete)**: 고유 ID를 식별자로 하여 특정 글 삭제 (DELETE)
- **데이터 영속성**: 서버를 재시작해도 SQLite DB에 데이터가 유지됨

## 5. API 명세서

| **기능** | **메서드** | **경로** | **설명** |
| --- | --- | --- | --- |
| 목록 조회 | GET | `/api/guestbook` | 모든 방명록 데이터를 가져옵니다. |
| 글 작성 | POST | `/api/guestbook` | 새로운 방명록을 DB에 저장합니다. |
| 글 삭제 | DELETE | `/api/guestbook/:id` | 해당 ID의 방명록을 삭제합니다. |

## 6. 성장 경험 (Lessons Learned)

- **API 명세의 중요성**: 프론트와 백엔드 간의 약속인 API 명세서를 미리 설계하는 법을 배웠습니다.
- **상태 코드와 디버깅**: 브라우저 개발자 도구(F12)를 통해 SyntaxError와 통신 에러를 해결하며 디버깅 능력을 키웠습니다.
- **메모리 vs DB**: 서버 변수에 저장할 때의 휘발성 문제를 해결하기 위해 SQLite를 도입하며 데이터베이스의 필요성을 체감했습니다.



## 추가 정보

- **node_modules**: 용량이 너무 크고, `npm install`만 하면 누구나 새로 받을 수 있기 때문에 깃허브에 올리지 않는 것이 관례입니다.
- **guestbook.db**: 이건 데이터 파일입니다. 보통 코드를 공유할 때는 '빈 창고(코드)'만 공유하고 '창고 안의 물건(데이터)'은 올리지 않습니다.
