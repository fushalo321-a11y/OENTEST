# 관리자 보안 설정 가이드

## 개요
이 프로젝트는 관리자 페이지에 강력한 보안 기능을 구현했습니다:
- IP 화이트리스트 기반 접근 제한
- 2단계 인증 (TOTP)
- 강력한 비밀번호 정책
- 로그인 시도 제한 및 계정 잠금

## 1. 환경변수 설정

`server/.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 서버 설정
PORT=5000
NODE_ENV=development

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# 관리자 보안 설정
ADMIN_IP_WHITELIST=127.0.0.1,::1,192.168.1.100
ADMIN_MFA_ENABLED=true
ADMIN_PASSWORD_POLICY_MIN_LENGTH=12
ADMIN_PASSWORD_POLICY_REQUIRE_UPPERCASE=true
ADMIN_PASSWORD_POLICY_REQUIRE_LOWERCASE=true
ADMIN_PASSWORD_POLICY_REQUIRE_NUMBERS=true
ADMIN_PASSWORD_POLICY_REQUIRE_SPECIAL_CHARS=true
ADMIN_MAX_LOGIN_ATTEMPTS=5
ADMIN_ACCOUNT_LOCKOUT_DURATION=30

# 2단계 인증 설정
MFA_ISSUER=OEN TEST Admin
MFA_ALGORITHM=SHA1
MFA_DIGITS=6
MFA_PERIOD=30
```

### 환경변수 설명

#### IP 화이트리스트 설정
- `ADMIN_IP_WHITELIST`: 관리자 접근을 허용할 IP 주소들 (쉼표로 구분)
- 예: `127.0.0.1,::1,192.168.1.100,203.241.xxx.xxx`
- CIDR 표기법 지원: `192.168.1.0/24`

#### 비밀번호 정책
- `ADMIN_PASSWORD_POLICY_MIN_LENGTH`: 최소 비밀번호 길이 (기본값: 12)
- `ADMIN_PASSWORD_POLICY_REQUIRE_UPPERCASE`: 대문자 필수 (true/false)
- `ADMIN_PASSWORD_POLICY_REQUIRE_LOWERCASE`: 소문자 필수 (true/false)
- `ADMIN_PASSWORD_POLICY_REQUIRE_NUMBERS`: 숫자 필수 (true/false)
- `ADMIN_PASSWORD_POLICY_REQUIRE_SPECIAL_CHARS`: 특수문자 필수 (true/false)

#### 로그인 보안
- `ADMIN_MAX_LOGIN_ATTEMPTS`: 최대 로그인 시도 횟수 (기본값: 5)
- `ADMIN_ACCOUNT_LOCKOUT_DURATION`: 계정 잠금 시간 (분 단위, 기본값: 30)

#### 2단계 인증
- `ADMIN_MFA_ENABLED`: 2단계 인증 활성화 (true/false)
- `MFA_ISSUER`: 2단계 인증 앱에 표시될 서비스명
- `MFA_ALGORITHM`: 해시 알고리즘 (SHA1/SHA256/SHA512)
- `MFA_DIGITS`: OTP 자릿수 (기본값: 6)
- `MFA_PERIOD`: OTP 갱신 주기 (초 단위, 기본값: 30)

## 2. 기본 관리자 계정

기본 관리자 계정 정보:
- **이메일**: `admin@example.com`
- **비밀번호**: `Admin123!@#`
- **역할**: `admin`

⚠️ **보안 주의사항**: 프로덕션 환경에서는 반드시 기본 비밀번호를 변경하세요!

## 3. 2단계 인증 설정 방법

### 3.1 관리자 로그인
1. `/admin/login` 페이지에 접속
2. 기본 계정으로 로그인
3. 2단계 인증이 활성화되어 있으면 OTP 입력 필요

### 3.2 2단계 인증 앱 설치
- **Google Authenticator** (iOS/Android)
- **Authy** (iOS/Android/Desktop)
- **Microsoft Authenticator** (iOS/Android)

### 3.3 2단계 인증 설정
1. 관리자 대시보드에서 "설정" 메뉴 클릭
2. "2단계 인증" 탭 선택
3. "2단계 인증 설정하기" 버튼 클릭
4. QR 코드를 스캔하거나 수동으로 시크릿 키 입력
5. 앱에서 생성된 6자리 코드 입력하여 활성화

## 4. 보안 기능 상세

### 4.1 IP 화이트리스트
- 허용된 IP에서만 관리자 페이지 접근 가능
- CIDR 표기법 지원 (예: `192.168.1.0/24`)
- 접근이 차단된 IP에서는 403 Forbidden 응답

### 4.2 로그인 시도 제한
- 5회 실패 시 계정 자동 잠금 (30분)
- 잠금 시간 동안 로그인 시도 불가
- 성공적인 로그인 시 시도 횟수 초기화

### 4.3 비밀번호 정책
- 최소 12자 이상
- 대문자, 소문자, 숫자, 특수문자 포함 필수
- 실시간 비밀번호 강도 표시
- 정책을 만족하지 않으면 변경 불가

### 4.4 2단계 인증 (TOTP)
- Google Authenticator/Authy 호환
- 30초마다 갱신되는 6자리 코드
- 2분 전후 시간 윈도우 허용
- QR 코드 및 수동 설정 지원

## 5. API 엔드포인트

### 5.1 인증 관련
- `POST /api/auth/login` - 관리자 로그인
- `POST /api/admin/mfa/setup` - 2단계 인증 설정
- `POST /api/admin/mfa/enable` - 2단계 인증 활성화
- `POST /api/admin/mfa/disable` - 2단계 인증 비활성화
- `POST /api/admin/change-password` - 비밀번호 변경

### 5.2 관리자 기능
모든 관리자 API는 다음 미들웨어를 거칩니다:
- `checkIPWhitelist` - IP 화이트리스트 검증
- `authenticateToken` - JWT 토큰 검증
- `requireAdmin` - 관리자 권한 확인

## 6. 보안 모범 사례

### 6.1 프로덕션 환경 설정
1. 강력한 JWT_SECRET 사용
2. HTTPS 강제 적용
3. 실제 IP 주소로 화이트리스트 설정
4. 정기적인 비밀번호 변경
5. 2단계 인증 필수 활성화

### 6.2 모니터링
- 로그인 시도 로그 확인
- IP 차단 이벤트 모니터링
- 2단계 인증 실패 패턴 분석

### 6.3 백업 및 복구
- 2단계 인증 시크릿 백업
- 관리자 계정 복구 절차 수립
- 비상 접근 방법 준비

## 7. 문제 해결

### 7.1 IP 차단 문제
- 현재 IP 주소 확인: `whatismyipaddress.com`
- 환경변수 `ADMIN_IP_WHITELIST`에 IP 추가
- 서버 재시작

### 7.2 2단계 인증 문제
- 시간 동기화 확인
- 앱 재설치 또는 시크릿 재설정
- 백업 코드 사용 (구현 예정)

### 7.3 계정 잠금 문제
- 30분 대기 후 재시도
- 서버 로그에서 잠금 상태 확인
- 필요시 서버 재시작으로 초기화

## 8. 개발 환경 설정

개발 환경에서는 다음 설정을 권장합니다:
```env
ADMIN_IP_WHITELIST=127.0.0.1,::1
ADMIN_MFA_ENABLED=false
ADMIN_MAX_LOGIN_ATTEMPTS=10
```

이렇게 하면 로컬 개발 시 보안 제한을 완화할 수 있습니다. 