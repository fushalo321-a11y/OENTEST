# 🗄️ 데이터베이스 분리 설정 가이드 (Windows)

## 📋 개요
운영 데이터와 관리자 데이터를 물리적으로 분리하여 보안을 강화하는 설정입니다.

## 🏗️ 데이터베이스 구조

### 운영 데이터베이스 (main_app_db)
- **용도**: 일반 사용자 데이터, 게시글, 신고 등
- **테이블**: users, posts, reports, warranty_sites, events
- **권한**: 읽기/쓰기

### 관리자 데이터베이스 (admin_panel_db)
- **용도**: 관리자 계정, 로그, 보안 설정 등
- **테이블**: admins, admin_logs, security_settings, admin_permissions, system_logs
- **권한**: 관리자만 접근

## 🔧 환경 변수 설정

### 1. 서버 환경 변수 (.env)
```env
# 운영 데이터베이스
MAIN_DB_HOST=localhost
MAIN_DB_PORT=5432
MAIN_DB_NAME=main_app_db
MAIN_DB_USER=postgres
MAIN_DB_PASSWORD=postgres

# 관리자 데이터베이스
ADMIN_DB_HOST=localhost
ADMIN_DB_PORT=5432
ADMIN_DB_NAME=admin_panel_db
ADMIN_DB_USER=postgres
ADMIN_DB_PASSWORD=postgres

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-here

# 보안 설정
ADMIN_IP_WHITELIST=127.0.0.1,::1
ADMIN_MFA_ENABLED=true
ADMIN_MAX_LOGIN_ATTEMPTS=5
ADMIN_ACCOUNT_LOCKOUT_DURATION=30
```

## 🗄️ PostgreSQL 설정 (Windows)

### 1. 데이터베이스 생성
```sql
-- PostgreSQL에 접속 후 실행
CREATE DATABASE main_app_db;
CREATE DATABASE admin_panel_db;
```

### 2. 스키마 적용
```bash
# 운영 DB 스키마 적용
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d main_app_db -f server/database/main_db_schema.sql

# 관리자 DB 스키마 적용
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d admin_panel_db -f server/database/admin_db_schema.sql
```

### 3. pgAdmin 4를 사용한 설정 (GUI 방식)
1. **pgAdmin 4 실행**
   - 시작 메뉴 → PostgreSQL 17 → pgAdmin 4

2. **데이터베이스 생성**
   - Servers → PostgreSQL 17 → Databases 우클릭 → Create → Database
   - `main_app_db` 생성
   - `admin_panel_db` 생성

3. **스키마 적용**
   - 각 데이터베이스 선택 → Query Tool
   - 해당 스키마 파일 내용 복사하여 실행

## 🔐 보안 강화 설정

### 1. 사용자 생성 및 권한 설정 (선택사항)
```sql
-- 운영 DB 사용자 생성
CREATE USER app_user WITH PASSWORD 'secure_app_password';
GRANT CONNECT ON DATABASE main_app_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- 관리자 DB 사용자 생성
CREATE USER admin_user WITH PASSWORD 'very_secure_admin_password';
GRANT CONNECT ON DATABASE admin_panel_db TO admin_user;
GRANT USAGE ON SCHEMA public TO admin_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_user;
```

### 2. SSL 연결 강제
```sql
-- postgresql.conf 설정 (C:\Program Files\PostgreSQL\17\data\postgresql.conf)
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

## 📊 모니터링 및 백업

### 1. 백업 스크립트 (Windows)
```batch
@echo off
REM backup_databases.bat

set DATE=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set DATE=%DATE: =0%

REM 운영 DB 백업
"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -U postgres main_app_db > C:\backup\main_%DATE%.sql

REM 관리자 DB 백업
"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -U postgres admin_panel_db > C:\backup\admin_%DATE%.sql

echo Backup completed: %DATE%
```

### 2. 작업 스케줄러 설정
1. **작업 스케줄러 열기**
   - Win + R → `taskschd.msc`

2. **기본 작업 만들기**
   - 매일 새벽 2시에 백업 스크립트 실행

## 🚀 서버 시작

### 1. 의존성 설치
```bash
cd server
npm install
```

### 2. 환경 변수 설정
```bash
# .env 파일을 server 폴더에 생성하고 위의 환경 변수 내용을 입력
```

### 3. 서버 시작
```bash
npm start
```

## 🔍 연결 상태 확인

### 1. 데이터베이스 연결 테스트
```javascript
// 서버 시작 시 자동으로 연결 상태를 확인합니다
console.log('✅ 데이터베이스 연결이 성공적으로 초기화되었습니다.');
console.log(`📊 운영 DB: ${mainDBConfig.database}`);
console.log(`🔐 관리자 DB: ${adminDBConfig.database}`);
```

### 2. 수동 연결 확인
```bash
# 운영 DB 연결 테스트
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d main_app_db -c "SELECT 1;"

# 관리자 DB 연결 테스트
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d admin_panel_db -c "SELECT 1;"
```

## 🛠️ 문제 해결

### 1. 연결 오류
```bash
# PostgreSQL 서비스 상태 확인
services.msc → PostgreSQL-x64-17 → 상태 확인

# 로그 확인
C:\Program Files\PostgreSQL\17\data\pg_log\
```

### 2. 권한 오류
```sql
-- 사용자 권한 확인
\du

-- 테이블 권한 확인
\dp
```

### 3. 성능 최적화
```sql
-- 인덱스 생성 확인
SELECT schemaname, tablename, indexname FROM pg_indexes WHERE schemaname = 'public';

-- 테이블 크기 확인
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size FROM pg_tables WHERE schemaname = 'public';
```

## 📈 성능 모니터링

### 1. 연결 풀 모니터링
```sql
-- 활성 연결 수 확인
SELECT count(*) FROM pg_stat_activity;

-- 데이터베이스별 연결 수
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

### 2. 쿼리 성능 분석
```sql
-- 느린 쿼리 확인
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

## 🔄 마이그레이션

### 기존 단일 DB에서 분리 DB로 마이그레이션
```sql
-- 1. 기존 데이터 백업
"C:\Program Files\PostgreSQL\17\bin\pg_dump.exe" -U postgres existing_db > backup.sql

-- 2. 운영 DB로 데이터 이전
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d main_app_db -f backup.sql

-- 3. 관리자 데이터만 관리자 DB로 이전
-- (관리자 관련 테이블만 선택적으로 이전)
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. 환경 변수 설정이 올바른지
2. PostgreSQL 서비스가 실행 중인지
3. 데이터베이스 사용자 권한이 올바른지
4. 방화벽 설정이 올바른지
5. PostgreSQL 설치 경로가 올바른지 