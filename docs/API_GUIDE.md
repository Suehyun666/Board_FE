# API 사용 가이드

## 📁 API 모듈 구조

```
src/api/
 ├─ axios.js        # axios 인스턴스 (기본 설정)
 ├─ boardApi.js     # 게시판 API
 ├─ commentApi.js   # 댓글 API
 └─ index.js        # 통합 export
```

**역할 분리 이유**:
- 기능별로 파일을 나눠서 유지보수 편리
- 규모가 커져도 구조가 깔끔하게 유지됨
- 각 API가 담당하는 역할이 명확함

---

## 🔧 사용 방법

### 1. Import

```javascript
// 좋은 방법: index.js를 통한 통합 import
import { boardApi, commentApi } from '@/api'

// 나쁜 방법: 직접 파일 import (비추천)
import { boardApi } from '@/api/boardApi'
```

### 2. 게시판 API (boardApi)

#### 게시글 목록 조회
```javascript
const response = await boardApi.getPosts(1, 20, '검색어')
// page: 1부터 시작 (백엔드는 0부터 시작하지만 자동 변환)
// size: 페이지 크기
// search: 검색 키워드 (선택)
```

#### 게시글 상세 조회
```javascript
const response = await boardApi.getPost(postId)
```

#### 게시글 작성
```javascript
// 파일 없이
const response = await boardApi.createPost({
  title: '제목',
  content: '내용'
})

// 파일 포함
const response = await boardApi.createPost(
  { title: '제목', content: '내용' },
  [file1, file2]  // File 객체 배열
)
```

#### 게시글 수정
```javascript
await boardApi.updatePost(postId, {
  title: '수정된 제목',
  content: '수정된 내용'
})
```

#### 게시글 삭제
```javascript
await boardApi.deletePost(postId)
```

---

### 3. 댓글 API (commentApi)

#### 댓글 목록 조회
```javascript
const response = await commentApi.getComments(postId)
```

#### 댓글 작성
```javascript
const response = await commentApi.createComment(postId, {
  content: '댓글 내용'
})
```

#### 댓글 수정
```javascript
await commentApi.updateComment(postId, commentId, {
  content: '수정된 댓글'
})
```

#### 댓글 삭제
```javascript
await commentApi.deleteComment(postId, commentId)
```

---

## 🌐 REST API 엔드포인트

### 게시판
- `GET /boards?page=0&size=20&keyword=검색어` - 목록 조회
- `GET /boards/{id}` - 상세 조회
- `POST /boards` - 작성
- `PUT /boards/{id}` - 수정
- `DELETE /boards/{id}` - 삭제

### 댓글
- `GET /boards/{postId}/comments` - 댓글 목록
- `POST /boards/{postId}/comments` - 댓글 작성
- `PUT /boards/{postId}/comments/{id}` - 댓글 수정
- `DELETE /boards/{postId}/comments/{id}` - 댓글 삭제

---

## 🎯 핵심 포인트

### ✅ URL 설계 원칙
- 리소스는 **복수형** 사용 (`boards`, `comments`)
- 계층 구조 명확: `/boards/{postId}/comments/{id}`
- RESTful 원칙 준수

### ✅ 페이지 번호
- **프론트엔드**: 1부터 시작 (사용자 친화적)
- **백엔드**: 0부터 시작 (Spring Data 기본)
- `boardApi.getPosts()`에서 자동 변환 (`page - 1`)

### ✅ 파일 업로드
- `multipart/form-data` 형식
- 최대 10개, 각 5MB 제한
- post 데이터는 JSON blob으로 전송

---

## 🚨 주의사항

### ❌ 하지 말 것
```javascript
// 직접 파일 import
import { boardApi } from './api/boardApi'

// 페이지 번호 0으로 시작
await boardApi.getPosts(0, 20)  // 1페이지를 보려면 1 사용
```

### ✅ 해야 할 것
```javascript
// index를 통한 import
import { boardApi } from '@/api'

// 페이지 번호 1로 시작
await boardApi.getPosts(1, 20)
```

---

## 🔄 마이그레이션 (구버전 → 신버전)

### 이전 (board.js)
```javascript
import { boardAPI } from '../../api/board'

boardAPI.getPosts(0, 10, 'search')  // page: 0부터
```

### 현재 (boardApi.js)
```javascript
import { boardApi } from '../../api'

boardApi.getPosts(1, 20, '검색어')  // page: 1부터
```

---

## 📝 환경 변수

`.env` 파일에 API 서버 주소 설정:
```
VITE_API_BASE_URL=https://api.moodie.shop
```

**주의**: 프로토콜(`https://`) 필수!
