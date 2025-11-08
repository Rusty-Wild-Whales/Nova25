from pathlib import Path
import modal

app = modal.App("civiclens-summarizer")

image = (
    modal.Image.debian_slim()
    .pip_install(
        "transformers==4.39.3",
        "torch==2.2.1",
        "sentencepiece==0.1.99"
    )
)

with image.imports():
    from transformers import pipeline


@app.cls(image=image)
class Summarizer:
    def __enter__(self):
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        return self

    @modal.method()
    def summarize(self, text: str, category: str) -> str:
        chunk = text[:4000]
        result = self.summarizer(chunk, max_length=180, min_length=50, do_sample=False)[0]["summary_text"].strip()
        return f"Focus: {category}. {result}"


@app.local_entrypoint()
def main(
  text: str | None = None,
  text_file: str | None = None,
  category: str = "General"
):
    payload = text
    if text_file:
        payload = Path(text_file).read_text()
    if not payload:
        raise SystemExit("No text provided for summarization.")
    summary = Summarizer().summarize.remote(payload, category)
    print(summary)
