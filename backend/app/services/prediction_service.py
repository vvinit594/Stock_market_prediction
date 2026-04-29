import pandas as pd

from app.models.lstm_model import LSTMModel
from app.models.xgboost_model import XGBoostModel
from app.utils.preprocessing import build_feature_frame, make_lstm_sequences


class PredictionService:
    """Prediction orchestration service combining features + model outputs."""

    def __init__(self) -> None:
        self.lstm = LSTMModel()
        self.xgb = XGBoostModel()

    def predict_from_frames(self, symbol: str, price_rows: list[dict], sentiment_rows: list[dict]) -> dict:
        price_df = pd.DataFrame(price_rows)
        sentiment_df = pd.DataFrame(sentiment_rows) if sentiment_rows else pd.DataFrame(columns=["date", "score"])
        features = build_feature_frame(price_df, sentiment_df)
        feature_cols = [
            "close",
            "ma10",
            "ma50",
            "rsi",
            "macd",
            "macd_signal",
            "bb_upper",
            "bb_lower",
            "daily_return",
            "sentiment_score",
            "sentiment_lag_1",
            "sentiment_lag_2",
        ]
        x, _ = make_lstm_sequences(features, feature_cols, seq_len=min(30, max(5, len(features) - 1)))
        latest = x[-1] if x else [[0.0] * len(feature_cols)]
        lstm_prob = self.lstm.predict(latest)
        xgb_prob = self.xgb.predict([v for row in latest for v in row][-len(feature_cols) :])
        confidence = round((0.7 * lstm_prob + 0.3 * xgb_prob), 4)
        signal = "BUY" if confidence >= 0.6 else "SELL" if confidence <= 0.4 else "HOLD"
        return {
            "signal": signal,
            "confidence": confidence,
            "explanation": f"{symbol.upper()} signal based on technical indicators + sentiment fusion.",
            "model_breakdown": {"lstm": round(lstm_prob, 4), "xgboost": round(xgb_prob, 4)},
        }

    def predict(self, symbol: str) -> dict:
        return {
            "signal": "BUY",
            "confidence": 0.84,
            "explanation": f"Preliminary signal for {symbol.upper()} based on trend + sentiment.",
            "model_breakdown": {"lstm": 0.84, "xgboost": 0.79},
        }
