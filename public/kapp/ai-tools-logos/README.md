# AI 도구 로고 (수기 배치)

진단 **AI 활용 탐색** 카드에 표시할 로고 파일을 이 폴더에 둡니다.

## 규칙

- **파일명:** `toolId`와 같은 이름 + 확장자. **WebP·PNG·SVG·JPG** 모두 사용 가능합니다. 화면에서는 같은 베이스 이름이면 **webp → png → svg → jpg** 순으로 자동 시도합니다. `logoPublicPath`가 비어 있으면 `/kapp/ai-tools-logos/{toolId}.webp`부터 찾습니다.
- **JSON:** `data/kappDiagnosis/aiToolsCatalog.json`의 `logoPublicPath` — 예: `/kapp/ai-tools-logos/chatgpt_team.webp` 또는 `.png`
- **권장:** 정사각형, 투명 배경, 가로세로 **최소 128px** (UI에서는 약 48~56px)
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
| Meta Advantage+ (예시) | `meta_advantage` | `meta_advantage.png` |
| H2O AutoML (예시) | `h2o_automl` | `h2o_automl.png` |
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
| 이루다/캐릭터 AI (Scatterlab 계열) | `scatterlab_hello` | scatterlab_hello.webp · scatterlab_hello.png … (동일 이름) |
| 에이닷 (A.) | `skt_a_dot` | skt_a_dot.webp · skt_a_dot.png … (동일 이름) |
| LINE CLOVA (일본 등) | `line_clova_jp` | line_clova_jp.webp · line_clova_jp.png … (동일 이름) |
| Preferred Networks (PFN) | `preferred_pfn` | preferred_pfn.webp · preferred_pfn.png … (동일 이름) |
| Stable Diffusion (Stability AI) | `stability_ai` | stability_ai.webp · stability_ai.png … (동일 이름) |
| Synthesia | `synthesia` | synthesia.webp · synthesia.png … (동일 이름) |
| Canva Magic Studio | `canva_magic` | canva_magic.webp · canva_magic.png … (동일 이름) |
| Sarvam AI | `sarvam_ai` | sarvam_ai.webp · sarvam_ai.png … (동일 이름) |
| Appier (AI 마케팅) | `appier_aixon` | appier_aixon.webp · appier_aixon.png … (동일 이름) |
| RELEX Solutions (AI 기획) | `relex_solutions` | relex_solutions.webp · relex_solutions.png … (동일 이름) |
| Vespa | `vespa_ai` | vespa_ai.webp · vespa_ai.png … (동일 이름) |
| SOPHiA GENETICS | `sophia_genetics` | sophia_genetics.webp · sophia_genetics.png … (동일 이름) |
| Klarna (AI 쇼핑 어시스턴트) | `klarna_ai` | klarna_ai.webp · klarna_ai.png … (동일 이름) |
| Grab (슈퍼앱 AI 기능) | `grab_ai` | grab_ai.webp · grab_ai.png … (동일 이름) |
| Hugging Face | `huggingface_hub` | huggingface_hub.webp · huggingface_hub.png … (동일 이름) |
| Databricks Mosaic / MLflow | `databricks_mosaic` | databricks_mosaic.webp · databricks_mosaic.png … (동일 이름) |
| IBM watsonx | `ibm_watsonx` | ibm_watsonx.webp · ibm_watsonx.png … (동일 이름) |
| JAIS / G42 (UAE) | `g42_jais` | g42_jais.webp · g42_jais.png … (동일 이름) |
| Aura (Telefónica) | `telefonica_aura` | telefonica_aura.webp · telefonica_aura.png … (동일 이름) |
| Leonardo.Ai | `leonardo_ai` | leonardo_ai.webp · leonardo_ai.png … (동일 이름) |
| Prosus / iFood AI (참고) | `prosus_naspers` | prosus_naspers.webp · prosus_naspers.png … (동일 이름) |
| Ollama | `oss_ollama` | oss_ollama.webp · oss_ollama.png … (동일 이름) |
| llama.cpp | `oss_llama_cpp` | oss_llama_cpp.webp · oss_llama_cpp.png … (동일 이름) |
| vLLM | `oss_vllm` | oss_vllm.webp · oss_vllm.png … (동일 이름) |
| Hugging Face Transformers | `oss_transformers` | oss_transformers.webp · oss_transformers.png … (동일 이름) |
| LangChain | `oss_langchain` | oss_langchain.webp · oss_langchain.png … (동일 이름) |
| LlamaIndex | `oss_llamaindex` | oss_llamaindex.webp · oss_llamaindex.png … (동일 이름) |
| ComfyUI | `oss_comfyui` | oss_comfyui.webp · oss_comfyui.png … (동일 이름) |
| Stable Diffusion web UI (A1111) | `oss_sd_webui` | oss_sd_webui.webp · oss_sd_webui.png … (동일 이름) |
| Open WebUI | `oss_open_webui` | oss_open_webui.webp · oss_open_webui.png … (동일 이름) |
| Whisper (OpenAI) | `oss_whisper` | oss_whisper.webp · oss_whisper.png … (동일 이름) |
| Chroma | `oss_chroma` | oss_chroma.webp · oss_chroma.png … (동일 이름) |
| text-generation-webui | `oss_textgen_webui` | oss_textgen_webui.webp · oss_textgen_webui.png … (동일 이름) |
| LocalAI | `oss_localai` | oss_localai.webp · oss_localai.png … (동일 이름) |
| 사내 전용 LLM (가명) | `internal_llm_placeholder` | `internal_llm_placeholder.png` |

---
*도구가 추가·변경되면 `node scripts/gen-logo-readme-table.cjs`로 이 README를 다시 생성할 수 있습니다.*
