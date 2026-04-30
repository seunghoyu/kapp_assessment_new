# Next 앱 경로 (`Web/`)

소스 코드상 Next.js App Router 루트는 저장소의 **`Web/`** 디렉터리입니다.

문서나 이슈에서 예전처럼 `app/...`, `components/...`, `lib/...`, `data/...` 라고 적혀 있으면, 실제 경로는 다음과 같습니다.

| 문서에 적힌 경로 | 실제 경로 |
|------------------|-----------|
| `app/...` | `Web/app/...` |
| `components/...` | `Web/components/...` |
| `lib/...` | `Web/lib/...` |
| `data/...` | `Web/data/...` |
| `public/...` | `Web/public/...` |
| `real_data/...` | `Web/real_data/...` |

루트의 `scripts/`·`digital_inbasket/`·기획용 CSV/JSON 등은 **`Web/` 밖**에 둡니다.

개발 서버: 저장소 루트에서 `npm run dev` 또는 `cd Web && npm run dev`.
