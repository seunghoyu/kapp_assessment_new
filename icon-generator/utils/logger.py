from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any


@dataclass(frozen=True)
class Logger:
    name: str = "icon-generator"

    def _ts(self) -> str:
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def _fmt(self, level: str, message: str) -> str:
        return f"[{self._ts()}] [{self.name}] [{level}] {message}"

    def info(self, message: str) -> None:
        print(self._fmt("INFO", message), flush=True)

    def success(self, message: str) -> None:
        print(self._fmt("SUCCESS", message), flush=True)

    def warning(self, message: str) -> None:
        print(self._fmt("WARN", message), flush=True)

    def error(self, message: str) -> None:
        print(self._fmt("ERROR", message), flush=True)

    def exception(self, message: str, exc: BaseException) -> None:
        details = f"{type(exc).__name__}: {exc}"
        print(self._fmt("ERROR", f"{message} ({details})"), flush=True)


def safe_repr(value: Any, max_len: int = 250) -> str:
    try:
        s = repr(value)
    except Exception:
        s = "<unreprable>"
    if len(s) <= max_len:
        return s
    return s[: max_len - 3] + "..."

