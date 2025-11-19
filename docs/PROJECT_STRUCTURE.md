# 프로젝트 구조

## 디렉토리 구조

```
src/
├── api/              # API 호출 (백엔드 통신)
│   ├── axios.js      # axios 인스턴스 설정
│   └── board.js      # 게시판 API 함수들
│
├── components/       # 재사용 가능한 공통 컴포넌트
│   ├── Button.jsx
│   ├── Button.css
│   ├── LoadingSpinner.jsx
│   └── LoadingSpinner.css
│
├── layout/           # 공통 레이아웃 (헤더, 푸터)
│   ├── Header.jsx
│   ├── Header.css
│   ├── Footer.jsx
│   ├── Footer.css
│   ├── MainLayout.jsx
│   └── Layout.css
│
├── pages/            # 페이지 컴포넌트 (라우팅 단위)
│   ├── home/
│   │   └── Home.jsx
│   ├── list/
│   │   ├── BoardList.jsx
│   │   └── BoardList.css
│   ├── detail/
│   │   ├── BoardDetail.jsx
│   │   └── BoardDetail.css
│   └── write/
│       ├── BoardWrite.jsx
│       └── BoardWrite.css
│
├── assets/           # 이미지, 폰트 등 정적 파일
├── App.jsx           # 메인 앱 컴포넌트
├── App.css
├── main.jsx          # 앱 진입점
└── index.css         # 전역 스타일
```

## 폴더별 역할

### 📁 api/
- 백엔드와 통신하는 모든 코드
- axios 설정, API 함수 정의
- **페이지에서 직접 axios 호출하지 말고 여기 함수 사용**

### 📁 components/
- 여러 페이지에서 재사용 가능한 UI 컴포넌트
- Button, Input, Card 등
- **페이지 고유 로직은 여기 넣지 말 것**

### 📁 layout/
- 모든 페이지에 공통으로 적용되는 레이아웃
- Header, Footer, Sidebar 등

### 📁 pages/
- 실제 화면 단위 (URL 경로와 1:1 매칭)
- 각 페이지는 독립된 폴더로 관리
- API 호출, 상태 관리, UI 조합 담당

### 📁 assets/
- 이미지, 폰트, 아이콘 등 정적 파일

## 파일 추가 가이드

### 새 페이지 추가
1. `src/pages/` 에 폴더 생성
2. 컴포넌트 파일 생성 (예: `MyPage.jsx`)
3. `App.jsx`에 라우트 추가

```jsx
import MyPage from './pages/mypage/MyPage'
// ...
<Route path="/mypage" element={<MyPage />} />
```

### 새 공통 컴포넌트 추가
1. `src/components/` 에 파일 생성
2. 다른 페이지에서 import해서 사용

```jsx
import MyComponent from '../../components/MyComponent'
```

### 새 API 추가
1. `src/api/board.js`에 함수 추가 또는
2. 새 API 파일 생성 (예: `user.js`)

```javascript
export const myAPI = {
  getData: () => api.get('/data'),
  postData: (data) => api.post('/data', data)
}
```

## 주요 파일 설명

### App.jsx
- 전체 앱의 라우팅 설정
- 모든 페이지 경로 정의

### api/axios.js
- axios 인스턴스 생성
- baseURL 설정 (.env의 VITE_API_BASE_URL 사용)
- 인터셉터 설정 (요청/응답 전처리)

### api/board.js
- 게시판 관련 API 함수들
- getPosts, getPost, createPost, updatePost, deletePost

### layout/MainLayout.jsx
- Header + 페이지 내용 + Footer 구조
- 모든 페이지에 자동 적용

## 환경 변수

`.env` 파일에 설정:
```
VITE_API_BASE_URL=SERVER_URL
# ex) VITE_API_BASE_URL=https://api.moodie.shop
```

코드에서 사용:
```javascript
import.meta.env.VITE_API_BASE_URL
```

## 스타일 규칙

- 전역 스타일: `src/index.css`
- 컴포넌트 스타일: 같은 폴더에 `.css` 파일
- CSS 클래스명: kebab-case (예: `.board-list`)

## 개발 시작

```bash
npm run dev
```

## 빌드

```bash
npm run build
```
