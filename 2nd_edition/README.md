# 개정 검토본

학생용 1~15차시의 현재본 스냅샷과 개정 검토본을 원본과 분리해 둔 폴더입니다. 원본 `web/lesson*.html`과 원본 `web/assets`에는 패치를 적용하지 않았습니다.

## 로컬에서 열기

프로젝트 루트에서 다음 명령을 실행합니다.

```bash
python3 -m http.server 8000 --bind 127.0.0.1 --directory web/2nd_edition
```

브라우저에서 `http://127.0.0.1:8000/`을 엽니다. 이 폴더만 서버의 루트로 삼아 실행할 수 있습니다. 각 차시는 현재본, 수정본, 나란히 비교로 열 수 있습니다. 모바일 너비의 비교 화면에서는 현재본·수정본 탭을 사용합니다.

## 폴더 구성

- `index.html`: 1~15차시 목차
- `compare.html?lesson=01`: 좌우 비교 화면. `01`부터 `15`까지 선택할 수 있습니다.
- `lesson01.html`~`lesson15.html`: 개정 검토본
- `original/lesson01.html`~`original/lesson15.html`: 현재본 스냅샷
- `assets`, `img`: 개정 검토본이 사용하는 독립 자산
- `original/assets`, `original/img`: 현재본 스냅샷이 사용하는 독립 자산
- `snapshot-manifest.json`: 원본 기준과 생성 파일의 SHA-256

본문에서 직접 연결되는 용어사전, 실험실, 준비 페이지와 프로젝트 안내도 두 영역에 각각 복사했습니다. `release.js`와 `gate.js`는 검토 페이지에서 불러오지 않으므로 1~15차시를 모두 열 수 있습니다.

## 재생성

```bash
python3 _workspace/review01-07-2026-09-12/build_2nd_edition.py
```

재생성 스크립트는 기존 `index.html`, `compare.html`, `README.md`를 지우지 않습니다. 현재 원본 해시가 manifest와 다르면 중단하며, 검토 패치는 임시 복사본에만 적용합니다.

## 웹에서 확인

검토본 주소: https://greatsong.github.io/ds-danggok-2026/2nd_edition/

이번 검토본에는 6·9·12차시의 반복 주의 정리를 반영했습니다. 7차시의 예측 시점 설명은 유지하며, `teacher-notes.html`에 교사용 보충과 설명 역할 기준을 정리했습니다.
