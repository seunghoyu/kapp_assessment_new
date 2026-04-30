## 아이콘 자동 생성 프로그램 (Python CLI)

`icon-generator/major_category_labels.unique.json`에 있는 직무 카테고리(문자열 배열)를 읽어서, OpenAI 이미지 생성 API(`gpt-image-1`)로 **투명 배경 PNG 아이콘(1024x1024)** 을 생성하고 `output/`에 저장합니다.

## 준비물
- Python 3.10+ 권장
- OpenAI API Key

## 설치

`icon-generator/` 폴더에서 실행:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 환경 변수 설정

`icon-generator/.env` 파일을 생성하고 아래처럼 입력:

```env
OPENAI_API_KEY=YOUR_KEY_HERE
```

선택(번역 모델 변경):

```env
OPENAI_TRANSLATION_MODEL=gpt-4.1-mini
```

## 실행 방법 (CLI)

`icon-generator/` 폴더에서:

```bash
python main.py
```

옵션:
- `--input`: 입력 JSON 경로 (기본: `./major_category_labels.unique.json`)
- `--output`: 출력 폴더 (기본: `./output`)
- `--limit`: 앞에서 N개만 생성 (테스트용)
- `--skip-existing`: 이미 PNG가 있으면 건너뜀

예시(1개만 테스트):

```bash
python main.py --limit 1
```

## Windows 배치 실행

`icon-generator/run.bat` 더블클릭 또는 cmd에서:

```bat
run.bat
```

작업이 끝나도 창이 닫히지 않도록 `pause`가 포함되어 있습니다.

