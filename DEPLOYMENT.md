# Master System - 배포 가이드

## 🚀 **빠른 배포**

### 1. **Netlify 배포 (권장)**
```bash
# 1. 빌드 생성
npm run build

# 2. Netlify CLI 설치 (선택사항)
npm install -g netlify-cli

# 3. 배포
netlify deploy --prod --dir=build
```

### 2. **Vercel 배포**
```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 배포
vercel --prod
```

### 3. **정적 서버 배포**
```bash
# 1. 빌드
npm run build

# 2. 로컬 테스트
npm run serve

# 3. build 폴더를 웹서버에 업로드
```

## 🔧 **환경 설정**

### **환경 변수**
```env
# 프로덕션 환경
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENVIRONMENT=production
REACT_APP_ENABLE_MFA=true
REACT_APP_IP_WHITELIST_ENABLED=true
```

### **보안 설정**
- **HTTPS 필수**: 모든 프로덕션 배포는 HTTPS를 사용해야 합니다
- **IP 화이트리스트**: 관리자 접근 IP를 제한하세요
- **MFA 활성화**: 프로덕션에서는 2단계 인증을 활성화하세요

## 📁 **배포 파일 구조**
```
build/
├── static/
│   ├── css/
│   │   └── main.9bff31f1.css (4.47 kB)
│   └── js/
│       └── main.57c6ceac.js (95.08 kB)
├── index.html
├── manifest.json
└── favicon.ico
```

## 🔒 **보안 체크리스트**

### **배포 전 확인사항**
- [ ] 소스맵 비활성화 (`GENERATE_SOURCEMAP=false`)
- [ ] 보안 헤더 설정 완료
- [ ] HTTPS 강제 적용
- [ ] 환경 변수 보안 설정
- [ ] 테스트 계정 제거 (프로덕션)

### **운영 중 보안**
- [ ] 정기적인 로그 모니터링
- [ ] 접근 로그 분석
- [ ] 보안 업데이트 적용
- [ ] 백업 정책 수립

## 🎯 **성능 최적화**

### **빌드 최적화**
- ✅ 코드 분할 (Code Splitting)
- ✅ 트리 쉐이킹 (Tree Shaking)
- ✅ 압축 및 최소화
- ✅ 정적 자산 캐싱

### **런타임 최적화**
- ✅ React Query 캐싱
- ✅ 이미지 최적화
- ✅ 폰트 최적화
- ✅ 번들 크기 최적화

## 📊 **모니터링**

### **성능 지표**
- **First Contentful Paint**: < 1.5초
- **Largest Contentful Paint**: < 2.5초
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### **보안 모니터링**
- 로그인 시도 추적
- 권한 접근 로그
- API 호출 모니터링
- 오류 로그 분석

## 🆘 **문제 해결**

### **일반적인 문제**
1. **라우팅 오류**: `_redirects` 파일 확인
2. **API 연결 오류**: CORS 설정 확인
3. **빌드 실패**: Node.js 버전 확인 (>=16.0.0)
4. **성능 이슈**: 번들 분석 실행

### **지원**
- 기술 문서: `/docs`
- 이슈 리포트: GitHub Issues
- 보안 문의: security@oentest.com

---

**Master System v1.0.0** - OEN TEST 관리자 패널 