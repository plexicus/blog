import json, os, sys, subprocess, pathlib, frontmatter, textwrap
from typing import Dict, List
from pydantic import BaseModel, Field
from openai import AzureOpenAI

class Multilingual(BaseModel):
    en: str
    de: str
    fr: str
    ja: str
    ko: str
    it: str
    nl: str
    sv: str
    no_: str = Field(..., alias="no")  # 'no' is keyword in Python
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

LANG_MAP = {
    "en": "English", "de": "German", "fr": "French", "ja": "Japanese",
    "ko": "Korean", "it": "Italian", "nl": "Dutch", "sv": "Swedish",
    "no": "Norwegian", "da": "Danish", "fi": "Finnish", "pt": "Portuguese",
    "zh": "Chinese (Simplified)", "ar": "Arabic", "he": "Hebrew",
    "tr": "Turkish", "pl": "Polish", "cs": "Czech", "id": "Indonesian"
}

client = AzureOpenAI(
    api_key=os.environ["AZURE_OPENAI_KEY"],
    api_version="2024-02-01",
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"]
)

files = json.loads(sys.argv[1])
for file in files:
    path = pathlib.Path(file)
    original = path.read_text()

    messages = [
        {"role": "system", "content": textwrap.dedent(f"""
            You are a professional translator. Return a **single JSON object** that, when
            validated by the Pydantic model below, passes without modification.

            ```python
            class Multilingual(BaseModel):
                {', '.join([f"{k}: str" for k in LANG_MAP])}
            ```

            For every language key, translate **the entire markdown** *verbatim*,
            preserving YAML front-matter, headings, code fences, embeds, and spacing.
            Do not add editor notes, comments, or extra keys.
        """)},
        {"role": "user", "content": original}
    ]

    try:
        response = client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
            temperature=0.2,
            max_tokens=80000,   # plenty for 20× expansion
            messages=messages
        )
    except Exception as e:
        # fallback if the main model is busy or quota-blocked
        response = client.chat.completions.create(
            model=os.getenv("MODEL_FALLBACK"),
            temperature=0.2,
            max_tokens=80000,
            messages=messages
        )

    translations = Multilingual.model_validate_json(response.choices[0].message.content)

    for lang_code in LANG_MAP:
        out_dir = pathlib.Path("blog/src/content/blog/translations") / path.relative_to("blog/src/content/blog").parent / lang_code
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / path.name
        # re-inject original front-matter if present
        if original.lstrip().startswith("---"):
            fm, body = frontmatter.parse(original).metadata, frontmatter.parse(original).content
            translated_body = translations.model_dump()[lang_code if lang_code != "no_" else "no"]
            out_file.write_text(frontmatter.dumps(frontmatter.Post(**fm, content=translated_body)))
        else:
            out_file.write_text(translations.model_dump()[lang_code if lang_code != "no_" else "no"])
