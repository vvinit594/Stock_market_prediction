"""Training entrypoint for LSTM + XGBoost models."""

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from xgboost import XGBClassifier

from app.utils.preprocessing import make_lstm_sequences
from ml_pipeline.dataset_builder import build_dataset

FEATURE_COLS = [
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


class LSTMClassifier(nn.Module):
    def __init__(self, input_size: int, hidden_size: int = 64, dropout: float = 0.2) -> None:
        super().__init__()
        self.lstm = nn.LSTM(input_size=input_size, hidden_size=hidden_size, batch_first=True)
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_size, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        out, _ = self.lstm(x)
        out = self.dropout(out[:, -1, :])
        out = self.fc(out)
        return torch.sigmoid(out)


def train(out_dir: str = "artifacts") -> None:
    dataset = build_dataset()
    if dataset.empty:
        raise RuntimeError("Dataset generation failed.")

    x_seq, y_seq = make_lstm_sequences(dataset, FEATURE_COLS, seq_len=30)
    if not x_seq:
        raise RuntimeError("Insufficient rows to build sequences.")

    x_tensor = torch.tensor(np.array(x_seq), dtype=torch.float32)
    y_tensor = torch.tensor(np.array(y_seq), dtype=torch.float32).unsqueeze(1)

    model = LSTMClassifier(input_size=len(FEATURE_COLS))
    criterion = nn.BCELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

    model.train()
    for _ in range(10):
        optimizer.zero_grad()
        preds = model(x_tensor)
        loss = criterion(preds, y_tensor)
        loss.backward()
        optimizer.step()

    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), out / "lstm.pt")

    # XGBoost baseline using flat feature rows.
    x_flat = dataset[FEATURE_COLS].fillna(0.0).values
    y_flat = dataset["target"].fillna(0).astype(int).values
    xgb = XGBClassifier(
        n_estimators=100,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        objective="binary:logistic",
        eval_metric="logloss",
    )
    xgb.fit(x_flat, y_flat)
    joblib.dump(xgb, out / "xgboost.pkl")

    metadata = {
        "feature_cols": FEATURE_COLS,
        "seq_len": 30,
        "lstm_epochs": 10,
        "rows": int(len(dataset)),
    }
    (out / "metadata.json").write_text(__import__("json").dumps(metadata, indent=2), encoding="utf-8")
    print("training completed")


if __name__ == "__main__":
    train()
