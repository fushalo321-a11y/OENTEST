# PostgreSQL 비밀번호 재설정 PowerShell 스크립트

Write-Host "PostgreSQL 비밀번호 재설정 스크립트" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# 1. PostgreSQL 서비스 중지
Write-Host "1. PostgreSQL 서비스 중지 중..." -ForegroundColor Yellow
Stop-Service -Name "postgresql-x64-17" -Force

# 2. 새 비밀번호 입력 받기
$newPassword = Read-Host "새 비밀번호를 입력하세요 (예: postgres123)" -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($newPassword))

# 3. 단일 사용자 모드로 PostgreSQL 시작하여 비밀번호 변경
Write-Host "2. 비밀번호 변경 중..." -ForegroundColor Yellow

$postgresPath = "C:\Program Files\PostgreSQL\17\bin\postgres.exe"
$dataPath = "C:\Program Files\PostgreSQL\17\data"

# 임시 SQL 파일 생성
$tempSqlFile = [System.IO.Path]::GetTempFileName()
"ALTER USER postgres PASSWORD '$plainPassword';" | Out-File -FilePath $tempSqlFile -Encoding ASCII

# 단일 사용자 모드로 실행
Start-Process -FilePath $postgresPath -ArgumentList "--single", "-D", $dataPath, "postgres" -RedirectStandardInput $tempSqlFile -Wait -NoNewWindow

# 임시 파일 삭제
Remove-Item $tempSqlFile -Force

# 4. PostgreSQL 서비스 재시작
Write-Host "3. PostgreSQL 서비스 재시작 중..." -ForegroundColor Yellow
Start-Service -Name "postgresql-x64-17"

# 5. 연결 테스트
Write-Host "4. 연결 테스트 중..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

try {
    $env:PGPASSWORD = $plainPassword
    $testResult = & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "SELECT 1;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 비밀번호 변경 성공!" -ForegroundColor Green
        Write-Host "새 비밀번호: $plainPassword" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "이제 .env 파일에서 MAIN_DB_PASSWORD와 ADMIN_DB_PASSWORD를 이 비밀번호로 설정하세요." -ForegroundColor Yellow
    } else {
        Write-Host "❌ 비밀번호 변경 실패" -ForegroundColor Red
        Write-Host $testResult -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 연결 테스트 실패: $($_.Exception.Message)" -ForegroundColor Red
}

# 환경 변수 정리
Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "스크립트 완료. 아무 키나 누르세요..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 