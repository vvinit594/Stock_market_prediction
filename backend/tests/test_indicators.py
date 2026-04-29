import pandas as pd

from app.utils.indicators import calculate_bollinger, calculate_ma, calculate_macd, calculate_rsi


def test_indicator_shapes():
    series = pd.Series([100 + i for i in range(80)])
    ma10 = calculate_ma(series, 10)
    rsi = calculate_rsi(series, 14)
    macd, signal = calculate_macd(series)
    upper, lower = calculate_bollinger(series)
    assert len(ma10) == len(series)
    assert len(rsi) == len(series)
    assert len(macd) == len(series)
    assert len(signal) == len(series)
    assert len(upper) == len(series)
    assert len(lower) == len(series)
