"""Evaluation script for trained model artifacts."""

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import torch
from sklearn.metrics import accuracy_score, f1_score

from ml_pipeline.train import FEATURE_COLS, LSTMClassifier


def evaluate(artifact_dir: str = "artifacts") -> dict:
    artifacts = Path(artifact_dir)
    data_path = artifacts / "dataset.csv"
    if not data_path.exists():
        raise FileNotFoundError("artifacts/dataset.csv not found; run training first.")
    df = pd.read_csv(data_path)
    x = df[FEATURE_COLS].fillna(0.0).values
    y = df["target"].fillna(0).astype(int).values

    xgb = joblib.load(artifacts / "xgboost.pkl")
    xgb_pred = (xgb.predict_proba(x)[:, 1] >= 0.5).astype(int)

    lstm = LSTMClassifier(input_size=len(FEATURE_COLS))
    lstm.load_state_dict(torch.load(artifacts / "lstm.pt", map_location="cpu"))
    lstm.eval()
    seq = np.expand_dims(x[-30:], axis=0) if len(x) >= 30 else np.expand_dims(np.pad(x, ((30 - len(x), 0), (0, 0))), axis=0)
    with torch.no_grad():
        _ = lstm(torch.tensor(seq, dtype=torch.float32)).item()

    metrics = {
        "xgboost_accuracy": float(accuracy_score(y, xgb_pred)),
        "xgboost_f1": float(f1_score(y, xgb_pred, zero_division=0)),
    }
    print(metrics)
    return metrics


if __name__ == "__main__":
    evaluate()
