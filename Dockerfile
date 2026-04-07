# 1. 베이스 이미지 (Node.js 18이 설치된 Linux)
FROM node:20-bookworm

# 2. 컨테이너 안에서 작업할 폴더 지정
WORKDIR /app

# [추가] 중요: 네이티브 모듈(sqlite3)을 직접 빌드하기 위한 도구 설치
# 리눅스 환경에서 C++ 코드를 컴파일할 수 있게 해줍니다.
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*


# 3. 패키지 파일 먼저 복사 (캐시 최적화)
COPY package*.json ./

# 4. 패키지 설치
RUN npm install --build-from-source

# 5. 나머지 전체 코드 복사
COPY . .

# 6. 3000번 포트 열기
EXPOSE 3000

# 7. 서버 실행
CMD ["node", "index.js"]