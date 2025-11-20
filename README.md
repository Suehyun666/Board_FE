# [게시판 CRUD] (Board_FE)

이 프로젝트는 게시판 프론트엔드 서비스입니다.

## 🎥 데모 영상 (Demo)

> `docs` 디렉토리에 있는 시연 영상입니다.

[▶️ 시연 영상 보러가기](./docs/작동영상.mp4)
https://github.com/user-attachments/assets/60a63892-2112-4062-a08e-082856248f6a


## 📂 문서 (Docs)

`docs` 디렉토리에는 프로젝트와 관련된 상세 문서들이 포함되어 있습니다.
* **기획서 및 설계**: 프로젝트 구조 및 와이어프레임 설명
* **API 명세**: 백엔드 연동을 위한 API 규격
* *(여기에 docs 폴더에 있는 파일들에 대한 설명을 적어주세요)*


## 🛠 설치 방법 (Installation)

이 프로젝트를 로컬 환경에서 실행하려면 다음 순서대로 진행해주세요.

1. 리포지토리를 클론합니다.
   ```bash
   git clone [https://github.com/Suehyun666/Board_FE.git](https://github.com/Suehyun666/Board_FE.git)
   ```

2.  프로젝트 폴더로 이동합니다.
    ```bash
    cd Board_FE
    ```
3.  의존성 패키지를 설치합니다.
    ```bash
    npm install
    ```

## ⚙️ 환경 설정 (.env)

프로젝트 실행을 위해 환경 변수 설정이 필요합니다.
루트 디렉토리에 `.env` 파일을 생성하고 아래 내용을 작성해주세요.

1.  `.env` 파일을 생성합니다.
2.  아래 내용을 붙여넣고, 본인의 환경에 맞는 값을 입력하세요.

<!-- end list -->

```bash
# .env 예시
REACT_APP_API_URL=http://localhost:8080
REACT_APP_API_KEY=your_api_key_here
# (필요한 환경변수들을 여기에 추가하세요)
```

## 🚀 실행 (Run)

설정이 완료되면 아래 명령어로 프로젝트를 실행할 수 있습니다.

```bash
npm start
```

````

### 팁
* **.env 파일 보안:** `.env` 파일에는 실제 비밀번호나 API 키가 들어가므로, 반드시 `.gitignore` 파일에 `.env`가 포함되어 있는지 확인해서 GitHub에 올라가지 않도록 하세요. 대신 `.env.example` 파일을 만들어서 빈 값만 넣어 올려두는 것이 관례입니다.
* **동영상 미리보기:** 동영상 링크만 걸어두면 밋밋할 수 있으니, 동영상의 주요 장면을 캡처해서 이미지(스크린샷)로 넣고, 그 이미지에 동영상 링크를 거는 방법도 많이 사용합니다.

