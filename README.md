# kapp_assessment_new

Next.js 앱은 **`Web/`** 디렉터리에 있습니다. 저장소 루트의 `npm run dev`는 `Web`으로 위임됩니다.

이전에 루트에 두었던 `node_modules` 폴더가 남아 있으면 용량만 차지하므로 삭제해도 됩니다. 의존성은 `Web/node_modules`만 사용합니다.

## 웹 앱 (Next.js)

```bash
# 루트에서 (권장)
npm install --prefix Web
npm run dev

# 또는 Web 폴더에서
cd Web
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

편집은 주로 [`Web/app/page.tsx`](Web/app/page.tsx) 및 [`Web/app/`](Web/app/) 하위 라우트에서 합니다.

## 기타 폴더

| 경로 | 설명 |
|------|------|
| [`Web/`](Web/) | Next 앱 (`app`, `components`, `data`, `public`, `lib`, 설정 파일) |
| [`scripts/`](scripts/) | 데이터·메뉴 등 유틸 스크립트 (입력/출력 경로는 `Web/` 기준으로 맞춤) |
| [`docs/`](docs/) | 설계·플로우 문서 |
| [`digital_inbasket/`](digital_inbasket/) | 참조용 정적 자산 (Next 빌드와 분리) |
| [`icon-generator/`](icon-generator/) | 아이콘 생성 도구 |

## 배포 (Vercel 등)

프로젝트 **Root Directory**를 `Web`으로 지정하세요.

## Next.js 자료

- [Next.js 문서](https://nextjs.org/docs)
- [배포](https://nextjs.org/docs/app/building-your-application/deploying)
