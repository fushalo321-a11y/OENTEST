# 🔐 PostgreSQL 비밀번호 수동 재설정 방법

## 방법 1: pgAdmin 4 사용 (가장 쉬운 방법)

### 1단계: pgAdmin 4 실행
```
시작 메뉴 → PostgreSQL 17 → pgAdmin 4
```

### 2단계: 서버에 연결
- 처음 실행 시 마스터 비밀번호 설정
- **Servers** → **PostgreSQL 17** 클릭
- 현재 비밀번호 입력 (기본값: 설치 시 설정한 비밀번호)

### 3단계: 비밀번호 변경
- **Servers** → **PostgreSQL 17** → **Login/Group Roles** → **postgres** 우클릭
- **Properties** 선택
- **Definition** 탭에서 **Password** 필드에 새 비밀번호 입력
- **Save** 클릭

## 방법 2: 명령줄 사용

### 1단계: PostgreSQL에 접속
```bash
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
```

### 2단계: 비밀번호 변경
```sql
ALTER USER postgres PASSWORD '새비밀번호';
```

### 3단계: 종료
```sql
\q
```

## 방법 3: 단일 사용자 모드 (비밀번호를 모를 때)

### 1단계: PostgreSQL 서비스 중지
```bash
net stop postgresql-x64-17
```

### 2단계: 단일 사용자 모드로 시작
```bash
"C:\Program Files\PostgreSQL\17\bin\postgres.exe" --single -D "C:\Program Files\PostgreSQL\17\data" postgres
```

### 3단계: 비밀번호 변경
```sql
ALTER USER postgres PASSWORD '새비밀번호';
\q
```

### 4단계: 서비스 재시작
```bash
net start postgresql-x64-17
```

## 방법 4: 자동화 스크립트 사용

### PowerShell 스크립트 실행
```bash
# 관리자 권한으로 PowerShell 실행 후
.\reset_postgres_password.ps1
```

### 배치 파일 실행
```bash
# 관리자 권한으로 명령 프롬프트 실행 후
reset_postgres_password.bat
```

## 🔧 비밀번호 설정 후 환경 변수 업데이트

비밀번호를 변경한 후 `server` 폴더에 `.env` 파일을 생성하고 다음 내용을 입력:

```env
# 운영 데이터베이스
MAIN_DB_HOST=localhost
MAIN_DB_PORT=5432
MAIN_DB_NAME=main_app_db
MAIN_DB_USER=postgres
MAIN_DB_PASSWORD=새로설정한비밀번호

# 관리자 데이터베이스
ADMIN_DB_HOST=localhost
ADMIN_DB_PORT=5432
ADMIN_DB_NAME=admin_panel_db
ADMIN_DB_USER=postgres
ADMIN_DB_PASSWORD=새로설정한비밀번호

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-here

# 보안 설정
ADMIN_IP_WHITELIST=127.0.0.1,::1
ADMIN_MFA_ENABLED=true
ADMIN_MAX_LOGIN_ATTEMPTS=5
ADMIN_ACCOUNT_LOCKOUT_DURATION=30
```

## ✅ 연결 테스트

비밀번호 설정 후 연결을 테스트:

```bash
# 데이터베이스 연결 테스트
node test_db_connection.js

# 또는 직접 psql로 테스트
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "SELECT 1;"
```

## 🚨 주의사항

1. **관리자 권한 필요**: 일부 작업은 관리자 권한이 필요합니다.
2. **서비스 중지**: 단일 사용자 모드 사용 시 PostgreSQL 서비스가 중지됩니다.
3. **백업**: 중요한 데이터가 있다면 비밀번호 변경 전에 백업하세요.
4. **보안**: 강력한 비밀번호를 사용하세요 (대문자, 소문자, 숫자, 특수문자 포함). 