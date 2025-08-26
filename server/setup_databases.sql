-- PostgreSQL 데이터베이스 설정 스크립트
-- 이 스크립트를 PostgreSQL에서 실행하여 데이터베이스와 사용자를 생성합니다.

-- 1. 운영 데이터베이스 생성
CREATE DATABASE main_app_db;

-- 2. 관리자 데이터베이스 생성
CREATE DATABASE admin_panel_db;

-- 3. 운영 DB 사용자 생성 (선택사항 - 보안 강화용)
-- CREATE USER app_user WITH PASSWORD 'secure_app_password';
-- GRANT CONNECT ON DATABASE main_app_db TO app_user;
-- GRANT USAGE ON SCHEMA public TO app_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- 4. 관리자 DB 사용자 생성 (선택사항 - 보안 강화용)
-- CREATE USER admin_user WITH PASSWORD 'very_secure_admin_password';
-- GRANT CONNECT ON DATABASE admin_panel_db TO admin_user;
-- GRANT USAGE ON SCHEMA public TO admin_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_user;

-- 5. 데이터베이스 목록 확인
\l

-- 6. 사용자 목록 확인
\du 