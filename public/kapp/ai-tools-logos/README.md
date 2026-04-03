# AI 도구 로고 (수기 배치)

진단 **AI 활용 탐색** 카드에 표시할 로고 파일을 이 폴더에 둡니다.

## 규칙

- **파일명:** `toolId`와 같은 이름 + 확장자. **WebP·PNG·SVG·JPG** 모두 사용 가능합니다. 화면에서는 같은 베이스 이름이면 **webp → png → svg → jpg** 순으로 자동 시도합니다. `logoPublicPath`가 비어 있으면 `/kapp/ai-tools-logos/{toolId}.webp`부터 찾습니다.
- **JSON:** `data/kappDiagnosis/aiToolsCatalog.json`의 `logoPublicPath` — 예: `/kapp/ai-tools-logos/chatgpt_team.webp` 또는 `.png`
- **권장:** 정사각형, 투명 배경, 가로세로 **최소 128px** (UI에서는 그리드 약 48px·모달 약 64px)
- 저작권·상표는 각 벤더 정책을 따릅니다. 파일이 없으면 카드에는 **이니셜 플레이스홀더**가 나옵니다.

## 도구별로 넣을 파일명 (catalog 기준)

| 표시 이름 | toolId | 이 폴더에 넣을 파일명 |
| --- | --- | --- |
| ChatGPT (Team/Enterprise) | `chatgpt_team` | `chatgpt_team.png` |
| GitHub Copilot | `copilot_github` | `copilot_github.png` |
| Cursor | `cursor` | `cursor.png` |
| Perplexity | `perplexity` | `perplexity.png` |
| Notion AI | `notion_ai` | `notion_ai.png` |
| Gamma | `gamma` | `gamma.png` |
| Google Gemini | `google_gemini` | google_gemini.webp · google_gemini.png … (동일 이름) |
| Claude (Anthropic) | `anthropic_claude` | anthropic_claude.webp · anthropic_claude.png … (동일 이름) |
| Amazon Bedrock | `aws_bedrock` | aws_bedrock.webp · aws_bedrock.png … (동일 이름) |
| Mistral AI | `mistral_ai` | mistral_ai.webp · mistral_ai.png … (동일 이름) |
| Aleph Alpha | `aleph_alpha` | aleph_alpha.webp · aleph_alpha.png … (동일 이름) |
| SAP Generative AI (Joule 등) | `sap_generative_ai` | sap_generative_ai.webp · sap_generative_ai.png … (동일 이름) |
| Cohere | `cohere_command` | cohere_command.webp · cohere_command.png … (동일 이름) |
| AI21 Studio | `ai21_studio` | ai21_studio.webp · ai21_studio.png … (동일 이름) |
| CLOVA X | `naver_clova_x` | naver_clova_x.webp · naver_clova_x.png … (동일 이름) |
| 뤼튼 (Wrtn) | `wrtn_ai` | wrtn_ai.webp · wrtn_ai.png … (동일 이름) |
| Solar (Upstage) | `upstage_solar` | upstage_solar.webp · upstage_solar.png … (동일 이름) |
| 이루다/캐릭터 AI | `scatterlab_hello` | scatterlab_hello.webp · scatterlab_hello.png … (동일 이름) |
| Stable Diffusion (Stability AI) | `stability_ai` | stability_ai.webp · stability_ai.png … (동일 이름) |
| Synthesia | `synthesia` | synthesia.webp · synthesia.png … (동일 이름) |
| Canva Magic Studio | `canva_magic` | canva_magic.webp · canva_magic.png … (동일 이름) |
| Sarvam AI | `sarvam_ai` | sarvam_ai.webp · sarvam_ai.png … (동일 이름) |
| Jais Chat | `g42_jais` | g42_jais.webp · g42_jais.png … (동일 이름) |
| Leonardo.Ai | `leonardo_ai` | leonardo_ai.webp · leonardo_ai.png … (동일 이름) |
| Ollama | `oss_ollama` | oss_ollama.webp · oss_ollama.png … (동일 이름) |
| ComfyUI | `oss_comfyui` | oss_comfyui.webp · oss_comfyui.png … (동일 이름) |
| Stable Diffusion web UI (A1111) | `oss_sd_webui` | oss_sd_webui.webp · oss_sd_webui.png … (동일 이름) |
| Open WebUI | `oss_open_webui` | oss_open_webui.webp · oss_open_webui.png … (동일 이름) |
| text-generation-webui | `oss_textgen_webui` | oss_textgen_webui.webp · oss_textgen_webui.png … (동일 이름) |
| LocalAI | `oss_localai` | oss_localai.webp · oss_localai.png … (동일 이름) |
| Grok (xAI) | `xai_grok` | xai_grok.webp · xai_grok.png … (동일 이름) |
| 제타 (Zeta) | `zeta_ai_kr` | zeta_ai_kr.webp · zeta_ai_kr.png … (동일 이름) |
| 크랙 (Crack) | `crack_ai` | crack_ai.webp · crack_ai.png … (동일 이름) |
| 채티 (Chatty) | `chatty_kr` | chatty_kr.webp · chatty_kr.png … (동일 이름) |
| EXAONE (LG AI Research) | `lg_exaone` | lg_exaone.webp · lg_exaone.png … (동일 이름) |
| Liner (라이너) | `liner_ai` | liner_ai.webp · liner_ai.png … (동일 이름) |
| Samsung Gauss | `samsung_gauss` | samsung_gauss.webp · samsung_gauss.png … (동일 이름) |
| Microsoft Copilot | `microsoft_copilot` | microsoft_copilot.webp · microsoft_copilot.png … (동일 이름) |
| Zapier | `zapier` | zapier.webp · zapier.png … (동일 이름) |
| n8n | `n8n` | n8n.webp · n8n.png … (동일 이름) |
| 사내 전용 LLM (가명) | `internal_llm_placeholder` | `internal_llm_placeholder.png` |

---
*도구가 추가·변경되면 `node scripts/gen-logo-readme-table.cjs`로 이 README를 다시 생성할 수 있습니다.*
