"""Technical indicators utilities."""

import pandas as pd


def calculate_ma(series: pd.Series, window: int) -> pd.Series:
    return series.rolling(window=window, min_periods=window).mean()


def calculate_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = delta.clip(lower=0).rolling(window=period, min_periods=period).mean()
    loss = (-delta.clip(upper=0)).rolling(window=period, min_periods=period).mean()
    rs = gain / loss.replace(0, pd.NA)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50)


def calculate_macd(series: pd.Series) -> tuple[pd.Series, pd.Series]:
    ema12 = series.ewm(span=12, adjust=False).mean()
    ema26 = series.ewm(span=26, adjust=False).mean()
    macd = ema12 - ema26
    signal = macd.ewm(span=9, adjust=False).mean()
    return macd, signal


def calculate_bollinger(series: pd.Series, window: int = 20, num_std: float = 2.0) -> tuple[pd.Series, pd.Series]:
    ma = series.rolling(window=window, min_periods=window).mean()
    std = series.rolling(window=window, min_periods=window).std()
    upper = ma + (num_std * std)
    lower = ma - (num_std * std)
    return upper, lower
