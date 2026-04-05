# AI 도구 로고 (수기 배치)

진단 **AI 활용 탐색** 카드에 표시할 로고 파일을 이 폴더에 둡니다.

## 규칙

- **파일명:** `toolId.webp` (화면은 **WebP만** 로드). `logoPublicPath`가 비어 있으면 `/kapp/ai-tools-logos/{toolId}.webp`를 씁니다. 예외: `internal_llm_placeholder`는 WebP 없이 **Twemoji 🔒**(보안) 아이콘을 씁니다.
- **JSON:** `data/kappDiagnosis/aiToolsCatalog.json`의 `logoPublicPath` — 예: `/kapp/ai-tools-logos/chatgpt_team.webp`
- **권장:** 정사각형, 투명 배경, 가로세로 **최소 128px** (UI에서는 그리드 약 48px·모달 약 64px)
- 저작권·상표는 각 벤더 정책을 따릅니다. 파일이 없으면 카드에는 **이니셜 플레이스홀더**가 나옵니다.

## 도구별로 넣을 파일명 (catalog 기준)

| 표시 이름 | toolId | 이 폴더에 넣을 파일명 |
| --- | --- | --- |
| ChatGPT | `chatgpt_team` | `chatgpt_team.webp` |
| GitHub Copilot | `copilot_github` | `copilot_github.webp` |
| Cursor | `cursor` | `cursor.webp` |
| Perplexity | `perplexity` | `perplexity.webp` |
| Notion AI | `notion_ai` | `notion_ai.webp` |
| Gamma | `gamma` | `gamma.webp` |
| Google Gemini | `google_gemini` | `google_gemini.webp` |
| Claude | `anthropic_claude` | `anthropic_claude.webp` |
| Amazon Bedrock | `aws_bedrock` | `aws_bedrock.webp` |
| Mistral AI | `mistral_ai` | `mistral_ai.webp` |
| Aleph Alpha | `aleph_alpha` | `aleph_alpha.webp` |
| SAP Generative AI | `sap_generative_ai` | `sap_generative_ai.webp` |
| Cohere | `cohere_command` | `cohere_command.webp` |
| AI21 Studio | `ai21_studio` | `ai21_studio.webp` |
| CLOVA X | `naver_clova_x` | `naver_clova_x.webp` |
| 뤼튼 | `wrtn_ai` | `wrtn_ai.webp` |
| Solar | `upstage_solar` | `upstage_solar.webp` |
| 이루다/캐릭터 AI | `scatterlab_hello` | `scatterlab_hello.webp` |
| Stable Diffusion | `stability_ai` | `stability_ai.webp` |
| Synthesia | `synthesia` | `synthesia.webp` |
| Canva Magic Studio | `canva_magic` | `canva_magic.webp` |
| Sarvam AI | `sarvam_ai` | `sarvam_ai.webp` |
| Jais Chat | `g42_jais` | `g42_jais.webp` |
| Leonardo.Ai | `leonardo_ai` | `leonardo_ai.webp` |
| Grok | `xai_grok` | `xai_grok.webp` |
| 제타 | `zeta_ai_kr` | `zeta_ai_kr.webp` |
| 크랙 | `crack_ai` | `crack_ai.webp` |
| 채티 | `chatty_kr` | `chatty_kr.webp` |
| EXAONE | `lg_exaone` | `lg_exaone.webp` |
| Liner | `liner_ai` | `liner_ai.webp` |
| Microsoft Copilot | `microsoft_copilot` | `microsoft_copilot.webp` |
| Zapier | `zapier` | `zapier.webp` |
| n8n | `n8n` | `n8n.webp` |
| 사내 전용 LLM | `internal_llm_placeholder` | `— (Twemoji 🔒, `AiExplorationFlow`)` |

---
*도구가 추가·변경되면 `node scripts/gen-logo-readme-table.cjs`로 이 README를 다시 생성할 수 있습니다.*
