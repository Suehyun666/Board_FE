# Board Frontend Kubernetes 배포 가이드

## 개요

이 문서는 Board 프론트엔드 애플리케이션을 Kubernetes 클러스터에 배포하는 방법을 설명합니다.

## 사전 요구사항

- Kubernetes 클러스터 접근 권한
- kubectl 설치 및 설정
- Docker Hub 또는 컨테이너 레지스트리 계정
- board-app namespace 생성
- cert-manager 설치 (HTTPS용)
- nginx-ingress-controller 설치

## 배포 단계

### 1. Namespace 생성 (이미 있다면 스킵)

```bash
kubectl create namespace board-app
```

### 2. Docker 이미지 빌드 및 푸시

#### 개발 환경
```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.moodie.shop \
  -t suehunpark/board-fe:dev-$(git rev-parse --short HEAD) \
  -t suehunpark/board-fe:dev-latest \
  .

docker push suehunpark/board-fe:dev-$(git rev-parse --short HEAD)
docker push suehunpark/board-fe:dev-latest
```

#### 프로덕션 환경
```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.moodie.shop \
  -t suehunpark/board-fe:$(git rev-parse --short HEAD) \
  -t suehunpark/board-fe:latest \
  .

docker push suehunpark/board-fe:$(git rev-parse --short HEAD)
docker push suehunpark/board-fe:latest
```

### 3. Kubernetes 리소스 배포

#### deployment.yml 수정
`k8s/deployment.yml` 파일에서 이미지 태그를 업데이트하세요:
```yaml
image: suehunpark/board-fe:<YOUR_IMAGE_TAG>
```

#### 배포 실행
```bash
# Service 배포
kubectl apply -f k8s/service.yml

# Deployment 배포
kubectl apply -f k8s/deployment.yml

# Ingress 배포 (도메인 설정 확인 후)
kubectl apply -f k8s/ingress.yml
```

### 4. 배포 확인

```bash
# Pod 상태 확인
kubectl get pods -n board-app -l app=board-frontend

# Service 확인
kubectl get svc -n board-app board-frontend-service

# Ingress 확인
kubectl get ingress -n board-app board-frontend-ingress

# Pod 로그 확인
kubectl logs -n board-app -l app=board-frontend --tail=100
```

### 5. Ingress 설정

`k8s/ingress.yml`에서 도메인을 설정하세요:
- `moodie.shop` - 메인 도메인
- 또는 `www.moodie.shop` - www 서브도메인
- 또는 `app.moodie.shop` - 앱 전용 서브도메인

현재 백엔드가 `api.moodie.shop`을 사용하므로, 프론트엔드는 다른 도메인을 사용해야 합니다.

### 6. DNS 설정

도메인의 DNS 레코드를 nginx-ingress-controller의 LoadBalancer IP로 설정:

```bash
# Ingress Controller의 External IP 확인
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

DNS에 A 레코드 추가:
```
moodie.shop → <EXTERNAL_IP>
```

## 환경변수 관리

### Vite 환경변수 특징

Vite는 **빌드 타임**에 환경변수를 번들에 포함시킵니다:
- `VITE_` 접두사가 붙은 환경변수만 클라이언트 코드에 노출됩니다
- 런타임에 환경변수를 변경할 수 없습니다
- 따라서 **Docker 이미지 빌드 시** 환경변수를 전달해야 합니다

### 환경별 이미지 빌드 전략

#### 방법 1: 환경별 이미지 태그 (권장)
```bash
# 개발
docker build --build-arg VITE_API_BASE_URL=https://api-dev.moodie.shop -t board-fe:dev .

# 스테이징
docker build --build-arg VITE_API_BASE_URL=https://api-staging.moodie.shop -t board-fe:staging .

# 프로덕션
docker build --build-arg VITE_API_BASE_URL=https://api.moodie.shop -t board-fe:prod .
```

#### 방법 2: CI/CD에서 자동 빌드
GitHub Actions 예시:
```yaml
- name: Build and push Docker image
  run: |
    docker build \
      --build-arg VITE_API_BASE_URL=${{ secrets.VITE_API_BASE_URL }} \
      -t suehunpark/board-fe:${{ github.sha }} \
      .
    docker push suehunpark/board-fe:${{ github.sha }}
```

## 롤링 업데이트

```bash
# 새 이미지로 업데이트
kubectl set image deployment/board-frontend \
  board-frontend=suehunpark/board-fe:NEW_TAG \
  -n board-app

# 롤아웃 상태 확인
kubectl rollout status deployment/board-frontend -n board-app

# 롤백이 필요한 경우
kubectl rollout undo deployment/board-frontend -n board-app
```

## 스케일링

```bash
# 수동 스케일링
kubectl scale deployment board-frontend --replicas=5 -n board-app

# HPA (Horizontal Pod Autoscaler) 설정
kubectl autoscale deployment board-frontend \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n board-app
```

## 트러블슈팅

### Pod이 시작되지 않는 경우
```bash
kubectl describe pod <pod-name> -n board-app
kubectl logs <pod-name> -n board-app
```

### Ingress가 동작하지 않는 경우
```bash
# Ingress 상세 정보 확인
kubectl describe ingress board-frontend-ingress -n board-app

# Ingress Controller 로그 확인
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```

### 이미지를 가져올 수 없는 경우
```bash
# ImagePullSecrets가 필요한 경우 (private registry)
kubectl create secret docker-registry regcred \
  --docker-server=<your-registry-server> \
  --docker-username=<your-username> \
  --docker-password=<your-password> \
  --docker-email=<your-email> \
  -n board-app
```

그 후 deployment.yml에 추가:
```yaml
spec:
  template:
    spec:
      imagePullSecrets:
        - name: regcred
```

## 헬스 체크

애플리케이션의 헬스 체크는 `/health` 엔드포인트를 사용합니다:
```bash
curl http://moodie.shop/health
# 응답: healthy
```

## 모니터링

```bash
# 리소스 사용량 확인
kubectl top pods -n board-app -l app=board-frontend

# 이벤트 확인
kubectl get events -n board-app --sort-by='.lastTimestamp'
```

## 정리 (삭제)

```bash
kubectl delete -f k8s/ingress.yml
kubectl delete -f k8s/deployment.yml
kubectl delete -f k8s/service.yml
```
