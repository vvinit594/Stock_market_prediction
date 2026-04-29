from app.services.sentiment_service import SentimentService


def test_sentiment_heuristic_labels():
    service = SentimentService()
    label1, score1 = service.classify_text("Stock beats estimates and shares surge.")
    label2, score2 = service.classify_text("Company misses guidance and shares drop.")
    assert label1 in {"positive", "neutral", "negative"}
    assert label2 in {"positive", "neutral", "negative"}
    assert score1 in {1.0, 0.0, -1.0}
    assert score2 in {1.0, 0.0, -1.0}


def test_aggregate_daily_sentiment():
    service = SentimentService()
    rows = [
        {"sentiment_label": "positive"},
        {"sentiment_label": "negative"},
        {"sentiment_label": "neutral"},
    ]
    agg = service.aggregate_daily_sentiment(rows)
    assert "score" in agg
    assert agg["positive_count"] == 1
    assert agg["negative_count"] == 1
    assert agg["neutral_count"] == 1
