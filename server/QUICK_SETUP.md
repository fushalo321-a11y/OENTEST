# 🚀 빠른 데이터베이스 설정 가이드

## 📋 단계별 설정

### 1. PostgreSQL 데이터베이스 생성

#### 방법 A: pgAdmin 4 사용 (권장)
1. **pgAdmin 4 실행**
   - 시작 메뉴 → PostgreSQL 17 → pgAdmin 4

2. **데이터베이스 생성**
   - Servers → PostgreSQL 17 → Databases 우클릭 → Create → Database
   - `main_app_db` 생성
   - `admin_panel_db` 생성

3. **스키마 적용**
   - `main_app_db` 선택 → Query Tool → `server/database/main_db_schema.sql` 내용 복사하여 실행
   - `admin_panel_db` 선택 → Query Tool → `server/database/admin_db_schema.sql` 내용 복사하여 실행

#### 방법 B: 명령줄 사용
```bash
# PostgreSQL에 접속 (비밀번호 입력 필요)
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres

# 데이터베이스 생성
CREATE DATABASE main_app_db;
CREATE DATABASE admin_panel_db;

# 스키마 적용
\c main_app_db
\i server/database/main_db_schema.sql

\c admin_panel_db
\i server/database/admin_db_schema.sql
```

### 2. 환경 변수 설정

`server` 폴더에 `.env` 파일을 생성하고 다음 내용을 입력:

```env
# 운영 데이터베이스
MAIN_DB_HOST=localhost
MAIN_DB_PORT=5432
MAIN_DB_NAME=main_app_db
MAIN_DB_USER=postgres
MAIN_DB_PASSWORD=your_postgres_password

# 관리자 데이터베이스
ADMIN_DB_HOST=localhost
ADMIN_DB_PORT=5432
ADMIN_DB_NAME=admin_panel_db
ADMIN_DB_USER=postgres
ADMIN_DB_PASSWORD=your_postgres_password

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-here

# 보안 설정
ADMIN_IP_WHITELIST=127.0.0.1,::1
ADMIN_MFA_ENABLED=true
ADMIN_MAX_LOGIN_ATTEMPTS=5
ADMIN_ACCOUNT_LOCKOUT_DURATION=30
```

### 3. 서버 시작

```bash
cd server
npm start
```

### 4. 연결 테스트

```bash
# 데이터베이스 연결 테스트
node test_db_connection.js
```

## 🔧 문제 해결

### PostgreSQL 비밀번호 확인
1. **pgAdmin 4에서 확인**
   - pgAdmin 4 실행 → Servers → PostgreSQL 17 우클릭 → Properties → Connection
   - 비밀번호 확인

##  수정된 PowerShell 명령어

다음 명령어들을 순서대로 실행하세요:

### 1. PostgreSQL 서비스 중지
```powershell
Stop-Service -Name "postgresql-x64-17" -Force
```

### 2. 새 비밀번호 설정
```powershell
$newPassword = "postgres123"
```

### 3. 임시 SQL 파일 생성
```powershell
$sqlContent = "ALTER USER postgres PASSWORD '$newPassword';"
$tempFile = [System.IO.Path]::GetTempFileName()
$sqlContent | Out-File -FilePath $tempFile -Encoding ASCII
```

### 4. 단일 사용자 모드로 실행 (수정된 방법)
```powershell
# 임시 파일 내용을 변수에 저장
$sqlCommands = Get-Content $tempFile -Raw

# 단일 사용자 모드로 실행
Start-Process -FilePath "C:\Program Files\PostgreSQL\17\bin\postgres.exe" -ArgumentList "--single", "-D", "C:\Program Files\PostgreSQL\17\data", "postgres" -RedirectStandardInput $tempFile -Wait -NoNewWindow
```

### 5. 임시 파일 삭제
```powershell
Remove-Item $tempFile -Force
```

### 6. PostgreSQL 서비스 재시작
```powershell
Start-Service -Name "postgresql-x64-17"
```

### 7. 연결 테스트
```powershell
$env:PGPASSWORD = "postgres123"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "SELECT 1;"
```

##  더 간단한 방법: 배치 파일 사용

위의 방법이 복잡하다면, 배치 파일을 사용하는 것이 더 간단합니다:

```powershell
# 프로젝트 폴더로 이동
cd "C:\Users\fusha\OneDrive\Desktop\CM\TEST\server"

# 배치 파일 실행
.\reset_postgres_password.bat
```

##  대안: pgAdmin 4에서 직접 변경

1. **pgAdmin 4 실행**
2. **서버 연결** (현재 비밀번호 또는 빈 값으로)
3. **Query Tool 열기**
4. **다음 SQL 실행**:
   ```sql
   ALTER USER postgres PASSWORD 'postgres123';
   ```

어떤 방법을 시도해보시겠습니까? 배치 파일 방법이 가장 간단하고 안정적입니다.

### 데이터베이스 존재 확인
```sql
-- 데이터베이스 목록 확인
\l

-- 사용자 목록 확인
\du
```

## 📊 설정 완료 확인

서버가 성공적으로 시작되면 다음 메시지가 표시됩니다:

```
🚀 서버가 포트 5000에서 실행 중입니다.
📊 운영 DB: main_app_db
🔐 관리자 DB: admin_panel_db
👤 관리자 계정: admin@example.com / Admin123!@#
```

## 🔐 기본 관리자 계정

- **이메일**: admin@example.com
- **비밀번호**: Admin123!@#
- **역할**: admin 