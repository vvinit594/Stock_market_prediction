"""LSTM model module placeholder for Phase 2."""


class LSTMModel:
    def __init__(self) -> None:
        self.name = "lstm"

    def predict(self, sequence_features: list[list[float]]) -> float:
        if not sequence_features:
            return 0.5
        last_close = sequence_features[-1][0]
        first_close = sequence_features[0][0]
        momentum = (last_close - first_close) / first_close if first_close else 0.0
        return max(0.05, min(0.95, 0.5 + momentum))
