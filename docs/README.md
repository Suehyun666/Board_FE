# 게시판 프로젝트

> Spring Boot + React 기반의 풀스택 게시판 애플리케이션

## 🚀 빠른 시작

### 필수 요구사항
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Docker (선택)

### 로컬 실행

**1. 백엔드 실행**
```bash
cd Board_BE
./gradlew bootRun
```
→ http://localhost:8080

**2. 프론트엔드 실행**
```bash
cd Board_FE
npm install
npm run dev
```
→ http://localhost:5173

---

## 📚 문서

- **[개발 가이드](./DEVELOPMENT.md)** - 초보자를 위한 상세한 개발 가이드
- **[API 명세](./API.md)** - REST API 문서 (예정)

---

## ✨ 주요 기능

### 현재 구현됨
- ✅ 회원가입 / 로그인
- ✅ 게시글 CRUD
- ✅ 댓글 CRUD
- ✅ 파일 업로드/다운로드
- ✅ 이미지 미리보기
- ✅ 검색 기능
- ✅ 페이징

### 개발 예정
- 🔜 좋아요 기능
- 🔜 대댓글 (답글)
- 🔜 프로필 이미지
- 🔜 알림 기능

---

## 🛠 기술 스택

### Backend
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- MySQL

### Frontend
- React 18
- React Router v6
- Axios
- Vite

### DevOps
- Docker
- Kubernetes
- ArgoCD

---

## 📁 프로젝트 구조

```
.
├── Board_BE/          # Spring Boot 백엔드
├── Board_FE/          # React 프론트엔드
└── docs/              # 문서
    ├── README.md
    └── DEVELOPMENT.md # 개발 가이드 ⭐
```

---

## 🤝 기여하기

1. 이슈 등록
2. Fork & 브랜치 생성
3. 코드 작성
4. PR 제출

상세한 내용은 [개발 가이드](./DEVELOPMENT.md)를 참고하세요.

---

## 📄 라이센스

MIT License

---

## 📞 문의

- GitHub Issues: [프로젝트 이슈](링크)
- 이메일: your-email@example.com
