from collections import Counter

from app.core.config import get_settings

settings = get_settings()


class SentimentService:
    """Sentiment scoring using FinBERT with a deterministic fallback heuristic."""

    def __init__(self) -> None:
        self._classifier = None

    def _ensure_model(self) -> None:
        if not settings.USE_FINBERT or self._classifier is not None:
            return
        try:
            from transformers import pipeline

            self._classifier = pipeline(
                "text-classification",
                model=settings.FINBERT_MODEL_NAME,
                tokenizer=settings.FINBERT_MODEL_NAME,
            )
        except Exception:
            self._classifier = None

    @staticmethod
    def label_to_score(label: str) -> float:
        mapping = {"positive": 1.0, "neutral": 0.0, "negative": -1.0}
        return mapping.get(label.lower(), 0.0)

    def classify_text(self, text: str) -> tuple[str, float]:
        self._ensure_model()
        if self._classifier:
            output = self._classifier(text[:512])[0]
            label = output["label"].lower()
            if label == "LABEL_0":
                label = "positive"
            elif label == "LABEL_1":
                label = "negative"
            elif label == "LABEL_2":
                label = "neutral"
            return label, self.label_to_score(label)

        lowered = text.lower()
        if any(word in lowered for word in ("surge", "beat", "gain", "bullish", "up")):
            return "positive", 1.0
        if any(word in lowered for word in ("drop", "miss", "loss", "bearish", "down")):
            return "negative", -1.0
        return "neutral", 0.0

    def annotate_news(self, news_items: list[dict]) -> list[dict]:
        enriched = []
        for item in news_items:
            text = " ".join([item.get("title", ""), item.get("description") or ""]).strip()
            label, score = self.classify_text(text)
            enriched.append({**item, "sentiment_label": label, "sentiment_score": score})
        return enriched

    def aggregate_daily_sentiment(self, news_items: list[dict]) -> dict:
        if not news_items:
            return {"score": 0.0, "positive_count": 0, "neutral_count": 0, "negative_count": 0}
        labels = [item.get("sentiment_label", "neutral") for item in news_items]
        counts = Counter(labels)
        score = sum(self.label_to_score(label) for label in labels) / len(labels)
        return {
            "score": round(score, 4),
            "positive_count": counts.get("positive", 0),
            "neutral_count": counts.get("neutral", 0),
            "negative_count": counts.get("negative", 0),
        }

    def get_daily_score(self, symbol: str) -> float:
        _ = symbol
        return 0.62
