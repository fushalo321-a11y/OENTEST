@echo off
echo PostgreSQL 비밀번호 재설정 스크립트
echo ======================================

echo 1. PostgreSQL 서비스 중지...
net stop postgresql-x64-17

echo 2. 단일 사용자 모드로 PostgreSQL 시작...
echo 새 비밀번호를 입력하세요 (예: postgres123):
set /p NEW_PASSWORD=

echo 3. 비밀번호 변경 중...
"C:\Program Files\PostgreSQL\17\bin\postgres.exe" --single -D "C:\Program Files\PostgreSQL\17\data" postgres << EOF
ALTER USER postgres PASSWORD '%NEW_PASSWORD%';
\q
EOF

echo 4. PostgreSQL 서비스 재시작...
net start postgresql-x64-17

echo 5. 비밀번호 변경 완료!
echo 새 비밀번호: %NEW_PASSWORD%
echo.
echo 이제 .env 파일에서 MAIN_DB_PASSWORD와 ADMIN_DB_PASSWORD를 이 비밀번호로 설정하세요.
pause 