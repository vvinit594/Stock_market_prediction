"""Preprocessing utilities for model-ready features."""

import pandas as pd

from app.utils.indicators import calculate_bollinger, calculate_ma, calculate_macd, calculate_rsi


def build_feature_frame(price_df: pd.DataFrame, sentiment_df: pd.DataFrame | None = None) -> pd.DataFrame:
    df = price_df.copy()
    df = df.sort_values("date")
    df["ma10"] = calculate_ma(df["close"], 10)
    df["ma50"] = calculate_ma(df["close"], 50)
    df["rsi"] = calculate_rsi(df["close"], 14)
    macd, macd_signal = calculate_macd(df["close"])
    df["macd"] = macd
    df["macd_signal"] = macd_signal
    bb_upper, bb_lower = calculate_bollinger(df["close"])
    df["bb_upper"] = bb_upper
    df["bb_lower"] = bb_lower
    df["daily_return"] = df["close"].pct_change().fillna(0)

    if sentiment_df is not None and not sentiment_df.empty:
        sent = sentiment_df.copy()
        sent = sent.rename(columns={"score": "sentiment_score"})
        df = df.merge(sent[["date", "sentiment_score"]], on="date", how="left")
    else:
        df["sentiment_score"] = 0.0

    df["sentiment_score"] = df["sentiment_score"].fillna(0.0)
    df["sentiment_lag_1"] = df["sentiment_score"].shift(1).fillna(0.0)
    df["sentiment_lag_2"] = df["sentiment_score"].shift(2).fillna(0.0)
    return df.fillna(0.0)


def make_lstm_sequences(df: pd.DataFrame, feature_cols: list[str], seq_len: int = 30) -> tuple[list[list[list[float]]], list[int]]:
    rows = df[feature_cols].values.tolist()
    close = df["close"].values.tolist()
    x, y = [], []
    for i in range(seq_len, len(rows)):
        x.append(rows[i - seq_len : i])
        y.append(1 if close[i] > close[i - 1] else 0)
    return x, y
