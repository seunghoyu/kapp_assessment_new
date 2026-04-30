from __future__ import annotations

import os
import time
from dataclasses import dataclass

from openai import OpenAI


@dataclass(frozen=True)
class Translator:
    client: OpenAI
    model: str

    def ko_to_en(self, text_ko: str, *, max_retries: int = 2, timeout_s: float | None = None) -> str:
        """
        Translate a Korean job category label into a short English noun phrase.
        Retries up to max_retries times on failure (total attempts = 1 + max_retries).
        """
        if not text_ko or not isinstance(text_ko, str):
            raise ValueError("text_ko must be a non-empty string")

        prompt = (
            "Translate the following Korean job category label into concise natural English.\n"
            "Return ONLY the English translation (no quotes, no punctuation, no extra words).\n"
            "Prefer 2-4 words, title case or sentence case is fine.\n"
            f"Korean: {text_ko}"
        )

        last_err: Exception | None = None
        for attempt in range(max_retries + 1):
            try:
                # Responses API (recommended in latest SDKs)
                resp = self.client.responses.create(
                    model=self.model,
                    input=prompt,
                    timeout=timeout_s,
                )

                # The SDK exposes output_text as a convenience.
                text = getattr(resp, "output_text", None) or ""
                text = text.strip()
                if not text:
                    raise RuntimeError("Empty translation output from model")
                return text
            except Exception as e:
                last_err = e
                if attempt >= max_retries:
                    break
                time.sleep(0.8 * (2**attempt))

        assert last_err is not None
        raise last_err


def create_translator(client: OpenAI) -> Translator:
    model = os.getenv("OPENAI_TRANSLATION_MODEL", "gpt-4.1-mini")
    return Translator(client=client, model=model)

