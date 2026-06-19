"""
stl_decompose.py — Seasonal-Trend decomposition using LOESS for Trends data.

Author: Donny (Kevin Chan), April 2026.

STL separates a Trends series into trend, seasonal, and residual components.
This is the canonical way to answer: "Is this a real category emergence,
a seasonal fingerprint, or noise on top of a flat baseline?"

References:
- Cleveland, Cleveland, McRae & Terpenning (1990) STL paper
- statsmodels.tsa.seasonal.STL (period=52 for weekly, robust=True for COVID-era)
- For multiple seasonalities use MSTL.
"""

from __future__ import annotations
from datetime import datetime
from typing import Optional


def stl_decompose(
    series: list[tuple[datetime, float]],
    period: int = 52,
    robust: bool = True,
):
    """
    Decompose a Trends series. Returns (trend, seasonal, residual) as lists
    of (timestamp, value) tuples plus a summary dict.

    Defaults assume weekly Trends data (period=52). For daily ≤270d data use
    period=7 (weekly seasonality) or pass through MSTL with [7, 365.25].
    """
    try:
        import pandas as pd
        from statsmodels.tsa.seasonal import STL
    except ImportError as e:
        raise RuntimeError("`pip install pandas statsmodels`") from e

    if len(series) < 2 * period:
        raise ValueError(
            f"Need at least 2*period={2*period} observations, got {len(series)}"
        )

    timestamps = [ts for ts, _ in series]
    values = [v for _, v in series]
    s = pd.Series(values, index=pd.DatetimeIndex(timestamps))

    result = STL(s, period=period, robust=robust).fit()

    trend = list(zip(s.index.to_pydatetime(), result.trend.tolist()))
    seasonal = list(zip(s.index.to_pydatetime(), result.seasonal.tolist()))
    residual = list(zip(s.index.to_pydatetime(), result.resid.tolist()))

    # Summary diagnostics that drive the verdict
    trend_slope = (result.trend.iloc[-1] - result.trend.iloc[0]) / max(1, len(result.trend))
    seasonal_amplitude = float(result.seasonal.max() - result.seasonal.min())
    residual_std = float(result.resid.std())
    signal_to_noise = (
        abs(result.trend.iloc[-1] - result.trend.iloc[0]) / residual_std
        if residual_std > 0 else float("inf")
    )

    summary = {
        "trend_slope_per_bucket": float(trend_slope),
        "trend_direction": (
            "RISING" if trend_slope > 0.1 else
            "FALLING" if trend_slope < -0.1 else
            "FLAT"
        ),
        "seasonal_amplitude": seasonal_amplitude,
        "residual_std": residual_std,
        "signal_to_noise": float(signal_to_noise),
        "fingerprint": _classify_fingerprint(
            trend_slope, seasonal_amplitude, residual_std
        ),
    }
    return trend, seasonal, residual, summary


def _classify_fingerprint(slope: float, seasonal_amp: float, resid_std: float) -> str:
    """
    Map the decomposition components to one of the four canonical archetypes
    from the skill: news-event, seasonal, sustained breakout, or fad.
    """
    if seasonal_amp > 20 and abs(slope) < 0.05:
        return "SEASONAL (strong annual fingerprint, flat trend)"
    if slope > 0.3 and seasonal_amp < 10 and resid_std < 8:
        return "SUSTAINED_BREAKOUT (rising trend, weak seasonality, low noise)"
    if abs(slope) < 0.1 and seasonal_amp < 10 and resid_std > 15:
        return "NOISY_FLAT (no real signal, mostly residual)"
    if slope < -0.3 and seasonal_amp < 10:
        return "DECLINING (falling trend, possibly fad post-peak)"
    if resid_std > 20:
        return "EVENT_DRIVEN (one-off shocks dominate residual)"
    return "MIXED (no single archetype dominates; inspect plot)"


def persistence_check(
    series: list[tuple[datetime, float]],
    threshold_quantile: float = 0.9,
) -> dict:
    """
    The skill's persistence rule: real categories survive 26 weeks; news
    spikes don't. Returns whether the value at +4w / +12w / +26w from the
    most recent peak still exceeds the threshold quantile of the series.
    """
    if len(series) < 26:
        return {"verdict": "INSUFFICIENT_HISTORY"}

    values = [v for _, v in series]
    sorted_v = sorted(values)
    threshold = sorted_v[int(len(sorted_v) * threshold_quantile)]

    peak_idx = max(range(len(values)), key=lambda i: values[i])
    checkpoints = {}
    for label, offset in [("+4w", 4), ("+12w", 12), ("+26w", 26)]:
        idx = peak_idx + offset
        if idx < len(values):
            checkpoints[label] = {
                "value": values[idx],
                "above_threshold": values[idx] >= threshold,
            }
        else:
            checkpoints[label] = {"value": None, "above_threshold": None}

    survives = all(
        cp["above_threshold"] for cp in checkpoints.values()
        if cp["above_threshold"] is not None
    )
    return {
        "peak_value": values[peak_idx],
        "threshold_q90": threshold,
        "checkpoints": checkpoints,
        "verdict": "PERSISTENT" if survives else "FAD_OR_SPIKE",
    }


if __name__ == "__main__":
    # Smoke test with a synthetic series
    import math
    import datetime as dt
    series = [
        (dt.datetime(2024, 1, 1) + dt.timedelta(weeks=i),
         50 + 0.5 * i + 10 * math.sin(2 * math.pi * i / 52))
        for i in range(104)
    ]
    trend, seasonal, residual, summary = stl_decompose(series)
    print("Summary:", summary)
    print("Persistence:", persistence_check(series))
