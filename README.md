# OEN TEST 커뮤니티 웹사이트

안전하고 강력한 보안 기능을 갖춘 커뮤니티 웹사이트입니다.

## 🚀 Netlify 배포 가이드

### 1. GitHub에 코드 업로드
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

### 2. Netlify 배포
1. [Netlify](https://netlify.com)에 접속
2. "New site from Git" 클릭
3. GitHub 선택 후 저장소 연결
4. 배포 설정:
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
5. "Deploy site" 클릭

### 3. 환경 변수 설정 (선택사항)
Netlify 대시보드 → Site settings → Environment variables에서:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 🛠️ 로컬 개발

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev:full

# 또는 개별 실행
npm run dev:server  # 백엔드 서버
npm run dev:client  # 프론트엔드 서버
```

## 📁 프로젝트 구조
```
├── client/                 # React 프론트엔드
│   ├── public/            # 정적 파일
│   ├── src/               # 소스 코드
│   └── build/             # 빌드 결과물
├── server/                # Node.js 백엔드
│   ├── models/           # 데이터베이스 모델
│   ├── routes/           # API 라우트
│   └── middleware/       # 미들웨어
└── netlify.toml          # Netlify 설정
```

## 🔒 보안 기능
- JWT 기반 인증
- Role-Based Access Control (RBAC)
- Rate Limiting
- XSS/CSRF 방지
- SQL Injection 방지
- Helmet 보안 헤더

## 🎨 주요 기능
- 사용자 인증 (로그인/회원가입)
- 게시물 작성/수정/삭제
- 댓글 시스템
- 관리자 대시보드
- 실시간 검색
- 반응형 디자인

## 🚀 배포 상태
- ✅ 프론트엔드 빌드 완료
- ✅ Netlify 설정 완료
- ✅ 보안 헤더 설정
- ✅ SPA 라우팅 설정

## 📞 지원
문제가 발생하면 GitHub Issues를 통해 문의해주세요. 