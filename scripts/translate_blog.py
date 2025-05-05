"""
Translate modified Markdown/MDX files into 19 languages using Azure OpenAI
and save them under blog/src/content/blog-translations/ mirroring
the original directory structure.

Run by translate-blog GitHub Action.
"""

import json
import os
import sys
import pathlib
import textwrap
import frontmatter
from typing import Dict
from pydantic import BaseModel, Field
from openai import AzureOpenAI

# -------- Pydantic schema --------
# Each field must be present in the JSON returned by the model.
class Multilingual(BaseModel):
    en: str
    de: str
    fr: str
    ja: str
    ko: str
    it: str
    nl: str
    sv: str
    no_: str = Field(..., alias="no")          # `no` is a Python keyword
    da: str
    fi: str
    pt: str
    zh: str
    ar: str
    he: str
    tr: str
    pl: str
    cs: str
    id: str


# Mapping for human-readable language names (optional, but handy for debugging)
LANG_MAP: Dict[str, str] = {
    "en": "English", "de": "German", "fr": "French", "ja": "Japanese",
    "ko": "Korean", "it": "Italian", "nl": "Dutch", "sv": "Swedish",
    "no": "Norwegian", "da": "Danish", "fi": "Finnish", "pt": "Portuguese",
    "zh": "Chinese (Simplified)", "ar": "Arabic", "he": "Hebrew",
    "tr": "Turkish", "pl": "Polish", "cs": "Czech", "id": "Indonesian"
}

# -------- Azure OpenAI client --------
client = AzureOpenAI(
    api_key=os.environ["AZURE_OPENAI_KEY"],
    api_version="2025-01-01-preview",
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
)

# Files to translate come in as a JSON array via CLI arg
files_to_translate = json.loads(sys.argv[1])

for file_path in files_to_translate:
    src_path = pathlib.Path(file_path)
    original_text = src_path.read_text(encoding="utf-8")

    # Build chat messages
    messages = [
        {
            "role": "system",
            "content": textwrap.dedent(
                f"""
                You are a professional translator.
                Return *one* JSON object EXACTLY matching this Pydantic model:

                ```python
                class Multilingual(BaseModel):
                    {', '.join([f"{k}: str" for k in LANG_MAP])}
                ```

                • Translate the ENTIRE Markdown verbatim into each language key.
                • Preserve YAML front-matter, headings, links, code blocks, etc.
                • No explanations, comments, or extra keys—only raw JSON.
                """
            ),
        },
        {"role": "user", "content": original_text},
    ]

    # Try primary model, fall back if needed
    for model_name in (
        os.getenv("AZURE_OPENAI_DEPLOYMENT"),
    ):
        try:
            response = client.beta.chat.completions.parse(
                model=model_name,
                temperature=0.2,
                max_tokens=16000,
                messages=messages,
                response_format=Multilingual
            )
            break  # success, exit loop
        except Exception as exc:
            last_exc = exc
    else:
        # Every model failed
        raise RuntimeError("OpenAI translation failed") from last_exc

    # Validate JSON against Pydantic schema
    translations = response.choices[0].message.parsed.model_dump()

    # -------- Write translated files --------
    for lang_code in LANG_MAP:
        # Fix field name for Norwegian
        key = lang_code if lang_code != "no" else "no_"
        translated_markdown = translations[key]

        # Build target path: blog-translations/<lang>/<same subdirs>/<filename>
        out_base = pathlib.Path("blog/src/content/blog-translations")
        relative_subpath = src_path.relative_to("blog/src/content/blog").parent
        out_dir = out_base / relative_subpath / lang_code
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / src_path.name

        # If the source has front-matter, keep metadata and swap body
        if original_text.lstrip().startswith("---"):
            post = frontmatter.loads(original_text)
            post.content = translated_markdown
            out_file.write_text(frontmatter.dumps(post), encoding="utf-8")
        else:
            out_file.write_text(translated_markdown, encoding="utf-8")
