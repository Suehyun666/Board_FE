# 게시판 프로젝트 개발 문서

> 초보 개발자를 위한 친절한 개발 가이드

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [현재 구현된 기능](#현재-구현된-기능)
3. [개발 예정 기능](#개발-예정-기능)
4. [프로젝트 구조](#프로젝트-구조)
5. [개발 가이드](#개발-가이드)
6. [API 명세](#api-명세)

---

## 프로젝트 개요

### 기술 스택

**백엔드**
- Java 17
- Spring Boot 3.x
- JPA (Hibernate)
- MySQL
- Gradle

**프론트엔드**
- React 18
- React Router v6
- Axios
- Vite

**인프라**
- Docker
- Kubernetes (k8s)
- ArgoCD

### 환경 변수

**백엔드** (`application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/board
    username: root
    password: your-password

file:
  upload-dir: ./uploads
```

**프론트엔드** (`.env`)
```
VITE_API_BASE_URL=https://api.moodie.shop
```

---

## 현재 구현된 기능

### ✅ 회원 관리
- [x] 회원가입
- [x] 로그인
- [x] 로그아웃
- [x] 회원 탈퇴
- [x] 내 정보 조회

### ✅ 게시글 관리
- [x] 게시글 목록 조회 (페이징)
- [x] 게시글 상세 조회
- [x] 게시글 작성
- [x] 게시글 수정 (본인만)
- [x] 게시글 삭제 (본인만)
- [x] 게시글 검색 (제목, 내용)
- [x] 첨부파일 업로드 (최대 10개, 각 5MB)
- [x] 첨부파일 다운로드
- [x] 이미지 미리보기

### ✅ 댓글 관리
- [x] 댓글 목록 조회
- [x] 댓글 작성
- [x] 댓글 수정 (본인만)
- [x] 댓글 삭제 (본인만)
- [x] 댓글 소프트 삭제

### ✅ 권한 관리
- [x] 작성자만 수정/삭제 버튼 표시
- [x] `isAuthor` 필드로 권한 체크 (보안 강화)
- [x] 본인 확인 로직 (백엔드에서 처리)

### ✅ 파일 관리
- [x] 파일 업로드 (multipart/form-data)
- [x] 파일 다운로드 (스트리밍)
- [x] 브라우저 캐싱 (1년)
- [x] 이미지 자동 미리보기

### ✅ UI/UX
- [x] 반응형 디자인
- [x] 로딩 스피너
- [x] 에러 처리
- [x] 공통 헤더/푸터
- [x] 버튼 컴포넌트

---

## 개발 예정 기능

### 🔜 우선순위 높음

#### 1. 좋아요 기능
- [ ] 게시글 좋아요/취소
- [ ] 좋아요 수 표시
- [ ] 중복 좋아요 방지

**개발 방법:**
```java
// 백엔드 Entity
@Entity
public class PostLike {
    @Id @GeneratedValue
    private Long id;

    @ManyToOne
    private Post post;

    @ManyToOne
    private User user;

    private Instant createdAt;
}

// Controller
@PostMapping("/boards/{postId}/like")
public ResponseEntity<ApiResult<Void>> toggleLike(
    @PathVariable Long postId,
    @RequestParam Long userId) {
    postLikeService.toggleLike(postId, userId);
    return ResponseEntity.ok(ApiResult.success());
}
```

```javascript
// 프론트엔드 API
export const boardApi = {
  toggleLike: (postId) => {
    const userId = localStorage.getItem('userId')
    return api.post(`/boards/${postId}/like?userId=${userId}`)
  }
}

// 컴포넌트
const [liked, setLiked] = useState(post.isLiked)
const [likeCount, setLikeCount] = useState(post.likeCount)

const handleLike = async () => {
  await boardApi.toggleLike(post.id)
  setLiked(!liked)
  setLikeCount(liked ? likeCount - 1 : likeCount + 1)
}
```

#### 2. 대댓글 (답글) 기능
- [ ] 댓글에 답글 작성
- [ ] 답글 목록 표시 (인덴트)
- [ ] 답글 깊이 제한 (2단계)

**개발 방법:**
```java
// 이미 Comment 엔티티에 구현되어 있음!
@ManyToOne
@JoinColumn(name = "parent_id")
private Comment parent;

@OneToMany(mappedBy = "parent")
private List<Comment> replies = new ArrayList<>();
```

```javascript
// 프론트엔드 - 댓글 컴포넌트 수정
const [replyingTo, setReplyingTo] = useState(null)

<button onClick={() => setReplyingTo(comment.id)}>답글</button>

{replyingTo === comment.id && (
  <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
    <textarea placeholder="답글을 입력하세요..." />
    <button>답글 작성</button>
  </form>
)}

{comment.replies?.map(reply => (
  <div className="reply" style={{ marginLeft: '40px' }}>
    {reply.content}
  </div>
))}
```

#### 3. 프로필 이미지
- [ ] 프로필 이미지 업로드
- [ ] 프로필 이미지 표시
- [ ] 기본 프로필 이미지

#### 4. 조회수 증가
- [ ] 게시글 조회 시 조회수 증가
- [ ] 중복 조회 방지 (쿠키/세션)

**개발 방법:**
```java
// PostService
@Transactional
public PostResponse get(Long id, Long currentUserId) {
    Post post = postRepository.findByIdWithDetails(id);

    // 조회수 증가
    post.increaseViewCount();

    List<CommentResponse> comments = commentService.list(id, currentUserId);
    return PostResponse.from(post, comments, currentUserId);
}
```

```java
// Post Entity
public void increaseViewCount() {
    this.viewCount = (this.viewCount == null ? 0L : this.viewCount) + 1;
}
```

### 🔜 우선순위 중간

#### 5. 게시글 목록에 썸네일 표시
- [ ] 첫 번째 이미지를 썸네일로 표시
- [ ] 이미지 없으면 기본 이미지

#### 6. 카테고리 기능
- [ ] 카테고리별 게시글 분류
- [ ] 카테고리 필터링

#### 7. 태그 기능
- [ ] 게시글에 태그 추가
- [ ] 태그로 검색

#### 8. 정렬 기능
- [ ] 최신순
- [ ] 인기순 (좋아요 많은 순)
- [ ] 조회수 순

### 🔜 우선순위 낮음

#### 9. 알림 기능
- [ ] 댓글 알림
- [ ] 좋아요 알림
- [ ] 답글 알림

#### 10. 신고 기능
- [ ] 게시글 신고
- [ ] 댓글 신고
- [ ] 관리자 검토

#### 11. 관리자 기능
- [ ] 관리자 페이지
- [ ] 사용자 관리
- [ ] 게시글 관리
- [ ] 통계 대시보드

---

## 프로젝트 구조

### 백엔드 구조

```
Board_BE/
├── src/main/java/org/board/board_be/
│   ├── config/               # 설정
│   │   ├── OpenApiConfig.java    # Swagger 설정
│   │   └── WebConfig.java        # CORS, 정적파일
│   │
│   ├── domain/               # 도메인 (엔티티 + 레포지토리)
│   │   ├── comment/
│   │   │   ├── Comment.java
│   │   │   └── CommentRepository.java
│   │   ├── post/
│   │   │   ├── Post.java
│   │   │   ├── PostFile.java
│   │   │   └── PostRepository.java
│   │   └── user/
│   │       ├── User.java
│   │       └── UserRepository.java
│   │
│   ├── service/              # 비즈니스 로직
│   │   ├── CommentService.java
│   │   ├── FileStorageService.java
│   │   ├── PostService.java
│   │   └── UserService.java
│   │
│   ├── web/                  # 웹 레이어
│   │   ├── controller/       # API 컨트롤러
│   │   │   ├── CommentController.java
│   │   │   ├── PostController.java
│   │   │   └── UserController.java
│   │   ├── dto/              # 요청/응답 DTO
│   │   │   ├── ApiResult.java
│   │   │   ├── CommentRequest.java
│   │   │   ├── CommentResponse.java
│   │   │   ├── PostRequest.java
│   │   │   ├── PostResponse.java
│   │   │   ├── UserRequest.java
│   │   │   └── UserResponse.java
│   │   └── exception/        # 예외 처리
│   │       ├── ErrorResponse.java
│   │       ├── GlobalExceptionHandler.java
│   │       └── ResourceNotFoundException.java
│   │
│   └── BoardBeApplication.java
│
├── k8s/                      # Kubernetes 배포 설정
├── argocd/                   # ArgoCD 설정
└── Dockerfile
```

### 프론트엔드 구조

```
Board_FE/
├── src/
│   ├── api/                  # API 호출
│   │   ├── axios.js          # Axios 인스턴스
│   │   ├── index.js          # API 통합 export
│   │   ├── boardApi.js       # 게시글 API
│   │   ├── commentApi.js     # 댓글 API
│   │   └── userApi.js        # 사용자 API
│   │
│   ├── components/           # 재사용 컴포넌트
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   ├── LoadingSpinner.jsx
│   │   └── LoadingSpinner.css
│   │
│   ├── layout/               # 레이아웃
│   │   ├── MainLayout.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.css
│   │
│   ├── pages/                # 페이지 컴포넌트
│   │   ├── home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   ├── list/
│   │   │   ├── BoardList.jsx
│   │   │   └── BoardList.css
│   │   ├── detail/
│   │   │   ├── BoardDetail.jsx
│   │   │   └── BoardDetail.css
│   │   ├── write/
│   │   │   ├── BoardWrite.jsx
│   │   │   └── BoardWrite.css
│   │   ├── login/
│   │   │   ├── LoginPage.jsx
│   │   │   └── LoginPage.css
│   │   ├── register/
│   │   │   ├── RegisterPage.jsx
│   │   │   └── RegisterPage.css
│   │   └── user/
│   │       ├── Mypage.jsx
│   │       ├── Mypage.css
│   │       ├── EditProfile.jsx
│   │       ├── EditProfile.css
│   │       ├── MyPosts.jsx
│   │       └── MyPosts.css
│   │
│   ├── router/               # 라우팅 (예정)
│   ├── App.jsx               # 메인 앱
│   ├── App.css
│   ├── main.jsx              # 진입점
│   └── index.css             # 전역 스타일
│
├── docs/                     # 문서
├── k8s/                      # Kubernetes 설정
└── .env                      # 환경 변수
```

---

## 개발 가이드

### 1. 새로운 기능 추가하기

#### Step 1: 백엔드 - Entity 작성

```java
// src/main/java/org/board/board_be/domain/like/PostLike.java
@Entity
@Table(name = "post_likes",
       uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"}))
@Getter @Setter
@NoArgsConstructor
public class PostLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }
}
```

#### Step 2: 백엔드 - Repository 작성

```java
// src/main/java/org/board/board_be/domain/like/PostLikeRepository.java
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostIdAndUserId(Long postId, Long userId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);
    long countByPostId(Long postId);
    void deleteByPostIdAndUserId(Long postId, Long userId);
}
```

#### Step 3: 백엔드 - Service 작성

```java
// src/main/java/org/board/board_be/service/PostLikeService.java
@Service
@Transactional
@RequiredArgsConstructor
public class PostLikeService {
    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public void toggleLike(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("게시글", postId));

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("사용자", userId));

        Optional<PostLike> existingLike =
            postLikeRepository.findByPostIdAndUserId(postId, userId);

        if (existingLike.isPresent()) {
            // 좋아요 취소
            postLikeRepository.delete(existingLike.get());
        } else {
            // 좋아요 추가
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUser(user);
            postLikeRepository.save(like);
        }
    }

    public boolean isLiked(Long postId, Long userId) {
        return postLikeRepository.existsByPostIdAndUserId(postId, userId);
    }

    public long getLikeCount(Long postId) {
        return postLikeRepository.countByPostId(postId);
    }
}
```

#### Step 4: 백엔드 - Controller 작성

```java
// src/main/java/org/board/board_be/web/controller/PostController.java
@PostMapping("/{postId}/like")
public ResponseEntity<ApiResult<Map<String, Object>>> toggleLike(
        @PathVariable Long postId,
        @RequestParam Long userId) {

    postLikeService.toggleLike(postId, userId);

    return ResponseEntity.ok(
        ApiResult.<Map<String, Object>>builder()
            .success(true)
            .data(Map.of(
                "isLiked", postLikeService.isLiked(postId, userId),
                "likeCount", postLikeService.getLikeCount(postId)
            ))
            .build()
    );
}
```

#### Step 5: 프론트엔드 - API 함수 작성

```javascript
// src/api/boardApi.js
export const boardApi = {
  // ... 기존 코드

  // 좋아요 토글
  toggleLike: (postId) => {
    const userId = localStorage.getItem('userId')
    if (!userId) throw new Error('로그인이 필요합니다.')
    return api.post(`/boards/${postId}/like?userId=${userId}`)
  }
}
```

#### Step 6: 프론트엔드 - 컴포넌트에서 사용

```javascript
// src/pages/detail/BoardDetail.jsx
const [liked, setLiked] = useState(post.isLiked)
const [likeCount, setLikeCount] = useState(post.likeCount)

const handleLike = async () => {
  if (!currentUserId) {
    alert('로그인이 필요합니다.')
    navigate('/login')
    return
  }

  try {
    const result = await boardApi.toggleLike(id)
    setLiked(result.isLiked)
    setLikeCount(result.likeCount)
  } catch (err) {
    console.error('좋아요 처리 실패:', err)
  }
}

// JSX
<button
  onClick={handleLike}
  className={`like-button ${liked ? 'liked' : ''}`}
>
  ❤️ {likeCount}
</button>
```

#### Step 7: 프론트엔드 - CSS 작성

```css
/* src/pages/detail/BoardDetail.css */
.like-button {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.like-button:hover {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.like-button.liked {
  border-color: #ef4444;
  background-color: #fee2e2;
  color: #dc2626;
}
```

---

### 2. API 연동 패턴

#### 기본 패턴

```javascript
// 1. API 함수 작성
export const boardApi = {
  getPost: (id) => api.get(`/boards/${id}`)
}

// 2. 컴포넌트에서 사용
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await boardApi.getPost(id)
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [id])

// 3. 렌더링
if (loading) return <div>로딩 중...</div>
if (error) return <div>에러: {error}</div>
if (!data) return <div>데이터 없음</div>

return <div>{data.title}</div>
```

#### FormData 업로드 패턴

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()

  const formData = new FormData()
  formData.append('post', new Blob([JSON.stringify({
    title: '제목',
    content: '내용'
  })], { type: 'application/json' }))

  files.forEach(file => {
    formData.append('files', file)
  })

  await api.post('/boards?userId=1', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
```

---

### 3. 컴포넌트 작성 패턴

#### 기본 구조

```javascript
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { someApi } from '../../api'
import Button from '../../components/Button'
import './ComponentName.css'

function ComponentName() {
  // 1. Hooks
  const navigate = useNavigate()
  const { id } = useParams()

  // 2. State
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // 3. Effects
  useEffect(() => {
    fetchData()
  }, [id])

  // 4. Handlers
  const fetchData = async () => {
    // ...
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // ...
  }

  // 5. Render
  if (loading) return <div>로딩 중...</div>

  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  )
}

export default ComponentName
```

---

### 4. 스타일링 가이드

#### CSS 변수 사용

```css
:root {
  --primary-color: #3b82f6;
  --text-main: #1f2937;
  --text-sub: #6b7280;
  --border-color: #e5e7eb;
  --bg-white: #ffffff;
}

.component {
  color: var(--text-main);
  border: 1px solid var(--border-color);
}
```

#### 반응형 디자인

```css
/* 모바일 우선 */
.container {
  padding: 20px;
}

/* 태블릿 */
@media (min-width: 768px) {
  .container {
    padding: 40px;
  }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## API 명세

### 게시글 API

| 메서드 | 경로 | 설명 | 권한 |
|--------|------|------|------|
| GET | `/boards` | 게시글 목록 | 전체 |
| GET | `/boards/{id}` | 게시글 상세 | 전체 |
| POST | `/boards` | 게시글 작성 | 로그인 |
| PUT | `/boards/{id}` | 게시글 수정 | 작성자 |
| DELETE | `/boards/{id}` | 게시글 삭제 | 작성자 |
| GET | `/boards/files/{fileName}` | 파일 다운로드 | 전체 |

### 댓글 API

| 메서드 | 경로 | 설명 | 권한 |
|--------|------|------|------|
| GET | `/boards/{postId}/comments` | 댓글 목록 | 전체 |
| POST | `/boards/{postId}/comments` | 댓글 작성 | 로그인 |
| PUT | `/boards/{postId}/comments/{id}` | 댓글 수정 | 작성자 |
| DELETE | `/boards/{postId}/comments/{id}` | 댓글 삭제 | 작성자 |

### 사용자 API

| 메서드 | 경로 | 설명 | 권한 |
|--------|------|------|------|
| POST | `/users/register` | 회원가입 | 전체 |
| POST | `/users/login` | 로그인 | 전체 |
| GET | `/users/{id}` | 내 정보 조회 | 로그인 |
| DELETE | `/users/{id}` | 회원 탈퇴 | 본인 |

---

## 자주 묻는 질문 (FAQ)

### Q1. 새로운 페이지를 추가하려면?

1. `src/pages/` 아래에 폴더 생성
2. `PageName.jsx`, `PageName.css` 작성
3. `App.jsx`에 라우트 추가

```javascript
// App.jsx
import NewPage from './pages/new/NewPage'

<Route path="/new" element={<NewPage />} />
```

### Q2. API 에러가 발생하면?

1. 브라우저 개발자 도구 → Network 탭 확인
2. 요청 URL, 파라미터, 헤더 확인
3. 응답 상태 코드 확인 (200, 400, 404, 500 등)
4. `axios.js` 인터셉터가 에러를 자동으로 alert 처리

### Q3. CORS 에러가 발생하면?

백엔드 `WebConfig.java`에서 프론트엔드 URL 추가:

```java
.allowedOrigins(
    "http://localhost:5173",
    "http://your-domain.com"  // 추가
)
```

### Q4. 파일 업로드가 안 되면?

1. 파일 크기 확인 (최대 5MB)
2. 파일 개수 확인 (최대 10개)
3. `Content-Type: multipart/form-data` 확인
4. FormData 형식 확인

---

## 배포 가이드

### 개발 환경 실행

**백엔드**
```bash
cd Board_BE
./gradlew bootRun
```

**프론트엔드**
```bash
cd Board_FE
npm install
npm run dev
```

### 프로덕션 빌드

**백엔드**
```bash
./gradlew build
docker build -t board-backend .
```

**프론트엔드**
```bash
npm run build
# dist/ 폴더가 생성됨
```

---

## 기여하기

1. 기능 개발 전 이슈 등록
2. 브랜치 생성: `feature/기능명`
3. 커밋 메시지: `feat: 기능 추가`
4. PR 작성 및 리뷰 요청

---

## 라이센스

MIT License

---

**문서 최종 업데이트:** 2025-01-20
**작성자:** Claude Code
