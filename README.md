# OEN TEST - 검증커뮤니티 플랫폼

안전하고 신뢰할 수 있는 커뮤니티 플랫폼입니다.

## 🚀 최적화된 기능

### 성능 최적화
- **번들 크기**: 152.16 kB (gzip 압축)
- **소스맵 비활성화**: 프로덕션 보안 강화
- **이미지 최적화**: WebP 포맷 지원
- **캐싱 전략**: 정적 자원 1년 캐시
- **코드 스플리팅**: React.lazy() 적용

### 보안 강화
- **CSP 헤더**: XSS 공격 방지
- **HSTS**: HTTPS 강제 적용
- **Frame 옵션**: 클릭재킹 방지
- **Content Type**: MIME 스니핑 방지

### SEO 최적화
- **메타 태그**: 완전한 SEO 메타데이터
- **Open Graph**: 소셜 미디어 공유 최적화
- **구조화된 데이터**: Schema.org 마크업
- **사이트맵**: 검색엔진 크롤링 최적화

## 📦 설치 및 실행

### 개발 환경
```bash
# 의존성 설치
npm run setup

# 개발 서버 실행
npm run dev:client
```

### 프로덕션 빌드
```bash
# 최적화된 빌드 생성
npm run build

# 빌드 분석 (번들 크기 확인)
npm run build:analyze
```

## 🚀 배포

### Netlify 배포
```bash
# 자동 배포 (Git 연동)
git push origin main

# 수동 배포
npm run deploy:netlify
```

### 배포 설정
- **빌드 명령**: `npm run build`
- **배포 디렉토리**: `client/build`
- **Node.js 버전**: 18.x
- **NPM 버전**: 9.x

## 🛠 기술 스택

### Frontend
- **React 18**: 최신 React 기능 활용
- **Tailwind CSS**: 유틸리티 퍼스트 CSS
- **React Router**: SPA 라우팅
- **React Query**: 서버 상태 관리
- **Lucide React**: 아이콘 라이브러리

### 개발 도구
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Webpack**: 번들러 (CRA 내장)

## 📊 성능 지표

### Core Web Vitals
- **LCP**: < 2.5초
- **FID**: < 100ms
- **CLS**: < 0.1

### 번들 분석
- **JavaScript**: 152.16 kB (gzip)
- **CSS**: 최적화된 Tailwind 출력
- **이미지**: WebP 포맷 우선

## 🔧 최적화 설정

### 빌드 최적화
```json
{
  "GENERATE_SOURCEMAP": false,
  "INLINE_RUNTIME_CHUNK": false,
  "SKIP_PREFLIGHT_CHECK": true
}
```

### 캐싱 전략
- **정적 자원**: 1년 캐시
- **HTML**: 캐시 없음
- **API 응답**: 적절한 캐시 헤더

## 📱 PWA 지원

- **Service Worker**: 오프라인 지원
- **매니페스트**: 앱 설치 가능
- **아이콘**: 다양한 크기 지원

## 🔒 보안 설정

### 헤더 보안
```
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
```

### CSP 정책
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
```

## 📈 모니터링

### 성능 모니터링
- **Web Vitals**: Core Web Vitals 추적
- **에러 추적**: 사용자 경험 모니터링
- **사용자 행동**: 분석 도구 연동

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

- **이메일**: support@oentest.com
- **문의**: 고객센터 페이지 이용

---

© 2024 OEN TEST Team. All rights reserved. 