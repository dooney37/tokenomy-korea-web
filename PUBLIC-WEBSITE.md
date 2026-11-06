# 무료 웹페이지 공개 — GitHub Pages

이 패키지는 ‘토크노미 코리아 연사 섭외 모니터링’ 정적 웹페이지입니다. 파일을 받는 것만으로 배포되지 않습니다. 자세한 화면 안내는 publish.html에 있습니다.

## 기존 자동 조사 피드는 그대로 유지

현재 공개 피드: https://dooney37.github.io/tokenomy-korea-monitor/monitor-feed.json
기존 수집기 저장소: https://github.com/dooney37/tokenomy-korea-monitor

위 저장소에는 이 웹페이지 패키지를 덮어쓰지 마세요. 예약 수집기의 Pages 배포가 웹페이지를 지울 수 있습니다. 별도의 새 공개 저장소(예: tokenomy-korea-web)를 만듭니다.

## 클릭 순서

1. GitHub 로그인 → https://github.com/new → 새 저장소 이름 입력 → Public → Create repository.
2. ZIP을 풉니다. 새 저장소의 uploading an existing file 또는 Add file → Upload files에서 ZIP 안의 파일·폴더를 경로 그대로 올리고 Commit changes 합니다. 첫 화면에 index.html, publish.html, css/, js/, data/, automation/이 있어야 합니다. ZIP 자체나 상위 폴더를 올리는 것이 아닙니다.
3. Settings → Pages → Source: Deploy from a branch → Branch: main, /(root) → Save. 기존 수집기의 GitHub Actions 설정과 다릅니다. 이 패키지에는 .github/workflows가 없고 예약 수집을 중복 활성화하지 않습니다.
4. 몇 분 뒤 Pages에 실제 표시된 Visit site 링크를 엽니다. 대시보드, 자동 조사 센터, 휴대전화 표시를 확인한 뒤 해당 주소를 공유하세요. 배포 전에 주소가 생성되었다고 판단하지 마세요.

파일이 폴더 없이 평탄화되면 화면이 깨집니다. 폴더 업로드가 안 되면 Add file → Create new file에서 css/README.md를 생성해 폴더를 만든 뒤 css 폴더 안의 Upload files로 css 파일들만 올립니다. js/, js/vendor/, data/, automation/도 같은 방식으로 패키지 경로를 재현합니다. index.html은 저장소 최상단입니다. .nojekyll은 숨김 파일입니다. 누락되어도 기본 파일들은 동작합니다.

GitHub Free의 공개 저장소 Pages를 이용합니다. 서버·유료 도메인 구입이 필요하지 않지만 GitHub의 정책·용량·트래픽·계정 제한은 적용됩니다. 비공개 저장소나 유료 기능을 선택하지 마세요. 개인 메모·연락처·백업 JSON·비밀번호·토큰은 업로드하지 않습니다. 공개 사이트에 로그인·비밀번호 보호·공동 편집 기능은 없습니다.

## 데이터와 이전

- 자동 결과는 위 공개 JSON을 읽기만 합니다. 방문자마다 열 때와 열린 동안 5분마다 다시 조회합니다. 외부 조사 예약은 기존 수집기가 담당합니다.
- 개인 행사·스피커·메모·검수 기록은 각자의 브라우저 localStorage 키 rwa-radar-workspace-v1에 저장됩니다. 개인 기록은 이 ZIP에 포함되지 않습니다.
- 미리보기에서 ‘내 데이터 백업’으로 보관한 JSON을 새 배포 주소의 ‘백업 불러오기’에서 직접 가져오세요. 기존 ID의 현재 값을 보존하고 새 ID만 추가하는 기존 가져오기 규칙을 따릅니다. 이전 미리보기 기록은 삭제하지 마세요.
- 같은 dooney37.github.io 도메인의 다른 프로젝트 사이트는 브라우저 저장 origin을 공유합니다. 개인 기록이 반드시 프로젝트 경로별로 분리되는 것은 아닙니다. 경로 구분을 위해 기존 키를 임의로 변경하지 않았습니다.
- 같은 링크를 전달해도 기자님의 개인 기록이 다른 기기·다른 사람에게 자동 전달되지는 않습니다.

## 갱신·오류

조사 JSON 갱신은 웹페이지 재배포가 필요하지 않습니다. 화면·코드 수정은 편집기 미리보기에서 최신 공개용 ZIP을 받아 웹페이지용 저장소의 같은 경로를 교체해야 합니다. 공개된 과거 페이지에서 다운로드하면 그 페이지에 있는 코드 버전이 묶입니다.

404: Pages 배포 완료, main/(root), 최상단 index.html을 확인합니다. 화면이 깨지면 css/js 폴더 구조를 확인합니다. 자동 결과가 없으면 공개 피드 URL·접근·실행 기록을 확인합니다. 접근 제한을 우회하지 않습니다.

수집 코드·설치 안내는 웹페이지 내부의 수집기 다운로드 기능이 작동하도록 포함한 공개 코드입니다. 이 ZIP에 .github 워크플로·개인 백업·.monitor-state·첨부 원본은 포함하지 않습니다. 웹페이지 배포와 별개로 수집기를 새로 설치할 필요는 없습니다.
