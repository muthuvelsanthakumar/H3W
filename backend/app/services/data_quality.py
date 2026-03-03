import pandas as pd
import numpy as np
from typing import Dict, Any, List
import json

class DataQualityService:
    @staticmethod
    def assess_quality(df: pd.DataFrame, settings: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Perform comprehensive data quality checks and return a health report.
        """
        if settings is None:
            settings = {
                "missing_threshold": 10.0,
                "duplicate_threshold": 5.0,
                "sensitivity": "balanced"
            }
            
        missing_threshold = settings.get("missing_threshold", 10.0)
        duplicate_threshold = settings.get("duplicate_threshold", 5.0)
        sensitivity = settings.get("sensitivity", "balanced")
        
        sensitivity_weight = 1.0
        if sensitivity == "high": sensitivity_weight = 1.5
        elif sensitivity == "low": sensitivity_weight = 0.5

        total_rows = len(df)
        total_cols = len(df.columns)
        
        if total_rows == 0:
            return {
                "health_score": 0.0,
                "summary": {"total_rows": 0, "total_columns": total_cols, "missing_values_total": 0, "duplicate_rows": 0},
                "columns": {},
                "alerts": [{"severity": "critical", "message": "The dataset is empty (0 rows)."}]
            }
        
        # 1. Missing Values
        missing_counts = df.isnull().sum().to_dict()
        missing_pct = {k: (v / total_rows) * 100 for k, v in missing_counts.items()}
        
        # 2. Duplicate Rows
        duplicate_count = df.duplicated().sum()
        duplicate_pct = (duplicate_count / total_rows) * 100
        
        # 3. Column Variety (Cardinality)
        cardinality = {col: df[col].nunique() for col in df.columns}
        
        # 4. Data Types & Consistency
        # Attempt to detect datetime columns
        date_cols = []
        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    pd.to_datetime(df[col], errors='raise')
                    date_cols.append(col)
                except (ValueError, TypeError):
                    pass
        
        # 5. Outlier Detection (Basic IQR for Numeric)
        outliers = {}
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            outlier_count = ((df[col] < lower_bound) | (df[col] > upper_bound)).sum()
            outliers[col] = int(outlier_count)

        # 6. Health Score Calculation (Proprietary Logic)
        # Weights: Missing (0.4), Duplicates (0.2), Outliers (0.2), Consistency (0.2)
        
        # Adjusted penalties based on settings
        missing_penalty = (sum(missing_pct.values()) / total_cols) * (10 / missing_threshold) * sensitivity_weight
        duplicate_penalty = duplicate_pct * (5 / duplicate_threshold) * sensitivity_weight
        
        missing_score = max(0, 100 - missing_penalty)
        duplicate_score = max(0, 100 - duplicate_penalty)
        outlier_score = 100 # Default
        if len(numeric_cols) > 0:
            avg_outlier_pct = sum([outliers[col] for col in numeric_cols]) / (total_rows * len(numeric_cols)) * 100
            outlier_score = max(0, 100 - (avg_outlier_pct * sensitivity_weight))
        
        final_score = (missing_score * 0.4) + (duplicate_score * 0.2) + (outlier_score * 0.2) + 20.0
        
        report = {
            "health_score": round(min(100, final_score), 2),
            "summary": {
                "total_rows": total_rows,
                "total_columns": total_cols,
                "missing_values_total": int(df.isnull().sum().sum()),
                "duplicate_rows": int(duplicate_count)
            },
            "columns": {
                col: {
                    "dtype": str(df[col].dtype),
                    "missing_pct": round(missing_pct[col], 2),
                    "cardinality": int(cardinality[col]),
                    "is_date_candidate": col in date_cols,
                    "outliers": outliers.get(col, 0)
                } for col in df.columns
            },
            "alerts": DataQualityService._generate_alerts(missing_pct, duplicate_pct, outliers, settings)
        }
        
        return report

    @staticmethod
    def _generate_alerts(missing_pct: Dict[str, float], duplicate_pct: float, outliers: Dict[str, int], settings: Dict[str, Any]) -> List[Dict[str, str]]:
        alerts = []
        dup_thresh = settings.get("duplicate_threshold", 5.0)
        miss_thresh = settings.get("missing_threshold", 10.0)

        if duplicate_pct > dup_thresh:
            alerts.append({"severity": "high", "message": f"Duplicates ({round(duplicate_pct, 1)}%) exceeds calibration threshold ({dup_thresh}%)."})
        
        for col, pct in missing_pct.items():
            if pct > miss_thresh * 2:
                alerts.append({"severity": "critical", "message": f"Column '{col}' is missing {round(pct, 1)}% data (Calibration Limit: {miss_thresh}%)."})
            elif pct > miss_thresh:
                alerts.append({"severity": "medium", "message": f"Column '{col}' missing values ({round(pct, 1)}%) exceeds threshold."})
        
        return alerts
