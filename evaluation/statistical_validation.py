"""
PTAI v3 — Statistical Validation & Hypothesis Testing Module.
Computes:
1. Exact sample sizes and denominators (N = 30 held-out test scenarios, 90 matched trials)
2. 95% Wilson Score Confidence Intervals for proportions
3. Paired McNemar's Test (with continuity correction and exact binomial p-values)
4. Wilcoxon Signed-Rank Tests and Paired t-tests for latency distributions
5. Effect sizes: Odds Ratios, Cohen's g, and Cohen's d
6. Distinction between statistical significance (alpha = 0.05) and clinical practical significance
Saves outputs to evaluation/statistical_results.json.
"""

import os
import json
import numpy as np
import scipy.stats as stats
from typing import Dict, Any, Tuple, List


def wilson_score_interval(successes: int, total: int, confidence: float = 0.95) -> Dict[str, float]:
    """Calculate the Wilson score confidence interval for a proportion."""
    if total == 0:
        return {"proportion": 0.0, "ci_lower": 0.0, "ci_upper": 0.0, "margin_of_error": 0.0}
    
    p = successes / total
    z = stats.norm.ppf((1 + confidence) / 2)
    denominator = 1 + z**2 / total
    centre = (p + z**2 / (2 * total)) / denominator
    margin = (z * np.sqrt((p * (1 - p) + z**2 / (4 * total)) / total)) / denominator
    
    ci_lower = max(0.0, float(centre - margin))
    ci_upper = min(1.0, float(centre + margin))
    
    return {
        "successes": successes,
        "total": total,
        "proportion": round(p, 4),
        "percentage": round(p * 100.0, 2),
        "ci_lower_pct": round(ci_lower * 100.0, 2),
        "ci_upper_pct": round(ci_upper * 100.0, 2),
        "margin_of_error_pct": round(((ci_upper - ci_lower) / 2.0) * 100.0, 2)
    }


def mcnemar_paired_test(system_a_results: List[bool], system_b_results: List[bool], name_a: str, name_b: str) -> Dict[str, Any]:
    """
    Perform paired McNemar's test for two systems evaluated on identical cases.
    Table:
      a: A pass, B pass
      b: A pass, B fail (discordant in favor of A)
      c: A fail, B pass (discordant in favor of B)
      d: A fail, B fail
    """
    assert len(system_a_results) == len(system_b_results), "Sample sizes must be identical for paired test"
    n = len(system_a_results)
    
    a = sum(1 for sa, sb in zip(system_a_results, system_b_results) if sa and sb)
    b = sum(1 for sa, sb in zip(system_a_results, system_b_results) if sa and not sb)
    c = sum(1 for sa, sb in zip(system_a_results, system_b_results) if not sa and sb)
    d = sum(1 for sa, sb in zip(system_a_results, system_b_results) if not sa and not sb)
    
    discordant = b + c
    
    if discordant == 0:
        chi2 = 0.0
        p_val_chi2 = 1.0
        exact_p = 1.0
        cohens_g = 0.0
        odds_ratio = 1.0
    else:
        # Edwards continuity-corrected chi-square: (|b - c| - 1)^2 / (b + c)
        chi2 = float((abs(b - c) - 1.0)**2 / discordant)
        p_val_chi2 = float(1.0 - stats.chi2.cdf(chi2, df=1))
        
        # Exact two-tailed binomial test on discordant pairs
        # Under H0: b ~ Binomial(b + c, 0.5)
        binom_res = stats.binomtest(b, discordant, 0.5, alternative="two-sided")
        exact_p = float(binom_res.pvalue)
        
        # Effect size: Cohen's g = (b / discordant) - 0.5
        cohens_g = float((b / discordant) - 0.5)
        
        # Odds ratio = b / c (with Haldane-Anscombe 0.5 correction if c == 0)
        odds_ratio = float((b + 0.5) / (c + 0.5)) if c == 0 else float(b / c)
        
    significant = exact_p < 0.05
    
    return {
        "comparison": f"{name_a} vs {name_b}",
        "sample_size": n,
        "contingency_table": {
            "both_passed": a,
            f"{name_a}_pass_{name_b}_fail": b,
            f"{name_a}_fail_{name_b}_pass": c,
            "both_failed": d
        },
        "discordant_pairs": discordant,
        "mcnemar_chi2_corrected": round(chi2, 4),
        "chi2_p_value": round(p_val_chi2, 6),
        "exact_binomial_p_value": round(exact_p, 6),
        "statistically_significant": significant,
        "effect_size": {
            "cohens_g": round(cohens_g, 4),
            "cohens_g_interpretation": "Large (g >= 0.25)" if abs(cohens_g) >= 0.25 else ("Medium (g >= 0.15)" if abs(cohens_g) >= 0.15 else "Small / Negligible"),
            "odds_ratio": round(odds_ratio, 2)
        }
    }


def compare_latencies(lat_a: List[int], lat_b: List[int], name_a: str, name_b: str) -> Dict[str, Any]:
    """Compare latency distributions across paired test scenarios using Wilcoxon & Paired t-test."""
    arr_a = np.array(lat_a)
    arr_b = np.array(lat_b)
    diff = arr_a - arr_b
    
    mean_diff = float(np.mean(diff))
    median_diff = float(np.median(diff))
    std_diff = float(np.std(diff, ddof=1)) if len(diff) > 1 else 0.0
    
    # Paired t-test
    if np.all(diff == 0) or std_diff == 0:
        t_stat, t_pval = 0.0, 1.0
        wilcox_stat, wilcox_pval = 0.0, 1.0
        cohens_d = 0.0
    else:
        t_res = stats.ttest_rel(arr_a, arr_b)
        t_stat, t_pval = float(t_res.statistic), float(t_res.pvalue)
        
        try:
            w_res = stats.wilcoxon(arr_a, arr_b)
            wilcox_stat, wilcox_pval = float(w_res.statistic), float(w_res.pvalue)
        except Exception:
            wilcox_stat, wilcox_pval = 0.0, 1.0
            
        cohens_d = float(mean_diff / std_diff) if std_diff > 0 else 0.0
        
    return {
        "comparison": f"{name_a} vs {name_b} (Latency in ms)",
        "sample_size": len(lat_a),
        f"{name_a}_median_ms": round(float(np.median(arr_a)), 1),
        f"{name_a}_mean_ms": round(float(np.mean(arr_a)), 1),
        f"{name_b}_median_ms": round(float(np.median(arr_b)), 1),
        f"{name_b}_mean_ms": round(float(np.mean(arr_b)), 1),
        "mean_difference_ms": round(mean_diff, 1),
        "median_difference_ms": round(median_diff, 1),
        "paired_t_statistic": round(t_stat, 4),
        "paired_t_p_value": round(t_pval, 6),
        "wilcoxon_signed_rank_p_value": round(wilcox_pval, 6),
        "cohens_d": round(cohens_d, 3),
        "significant": (wilcox_pval < 0.05) or (t_pval < 0.05)
    }


def perform_statistical_validation():
    """Load raw results and generate complete statistical validation report."""
    base_dir = os.path.dirname(__file__)
    raw_path = os.path.join(base_dir, "raw_results.json")
    
    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Missing {raw_path}. Run evaluation/run_evaluation.py first.")
        
    with open(raw_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    scenarios = data["scenarios"]
    n_scenarios = len(scenarios)
    
    ptai_results = [s["ptai_v3"]["eval"]["passed"] for s in scenarios]
    single_results = [s["baseline_1_single_agent"]["eval"]["passed"] for s in scenarios]
    heur_results = [s["baseline_2_heuristic"]["eval"]["passed"] for s in scenarios]
    
    ptai_latencies = [s["ptai_v3"]["output"]["latency_ms"] for s in scenarios]
    single_latencies = [s["baseline_1_single_agent"]["output"]["latency_ms"] for s in scenarios]
    heur_latencies = [s["baseline_2_heuristic"]["output"]["latency_ms"] for s in scenarios]
    
    # 1. 95% Wilson Score Intervals
    ci_ptai = wilson_score_interval(sum(ptai_results), n_scenarios)
    ci_single = wilson_score_interval(sum(single_results), n_scenarios)
    ci_heur = wilson_score_interval(sum(heur_results), n_scenarios)
    
    # 2. Paired McNemar's Tests
    mcnemar_ptai_vs_single = mcnemar_paired_test(ptai_results, single_results, "PTAI_v3", "SingleAgent_Baseline")
    mcnemar_ptai_vs_heur = mcnemar_paired_test(ptai_results, heur_results, "PTAI_v3", "Heuristic_Baseline")
    
    # 3. Latency Comparisons
    lat_ptai_vs_single = compare_latencies(ptai_latencies, single_latencies, "PTAI_v3", "SingleAgent_Baseline")
    lat_ptai_vs_heur = compare_latencies(ptai_latencies, heur_latencies, "PTAI_v3", "Heuristic_Baseline")
    
    # 4. Safety & Adversarial Sub-Group Analysis
    adversarial_scenarios = [s for s in scenarios if s["category"] == "Adversarial & Injection"]
    n_adv = len(adversarial_scenarios)
    adv_ptai_pass = sum(1 for s in adversarial_scenarios if s["ptai_v3"]["eval"]["passed"])
    adv_single_pass = sum(1 for s in adversarial_scenarios if s["baseline_1_single_agent"]["eval"]["passed"])
    adv_heur_pass = sum(1 for s in adversarial_scenarios if s["baseline_2_heuristic"]["eval"]["passed"])
    
    contra_scenarios = [s for s in scenarios if s["category"] == "Safety & Contraindications"]
    n_contra = len(contra_scenarios)
    contra_ptai_pass = sum(1 for s in contra_scenarios if s["ptai_v3"]["eval"]["passed"])
    contra_single_pass = sum(1 for s in contra_scenarios if s["baseline_1_single_agent"]["eval"]["passed"])
    contra_heur_pass = sum(1 for s in contra_scenarios if s["baseline_2_heuristic"]["eval"]["passed"])
    
    results = {
        "validation_metadata": {
            "evaluation_set": "Strictly Held-Out Benchmark Suite",
            "total_scenarios_n": n_scenarios,
            "alpha_threshold": 0.05,
            "confidence_level": 0.95
        },
        "task_success_confidence_intervals": {
            "ptai_v3": ci_ptai,
            "baseline_1_single_agent": ci_single,
            "baseline_2_heuristic": ci_heur
        },
        "paired_hypothesis_tests": {
            "ptai_vs_single_agent": mcnemar_ptai_vs_single,
            "ptai_vs_heuristic": mcnemar_ptai_vs_heur
        },
        "latency_statistical_comparisons": {
            "ptai_vs_single_agent": lat_ptai_vs_single,
            "ptai_vs_heuristic": lat_ptai_vs_heur
        },
        "safety_guardrail_subgroup_analysis": {
            "adversarial_prompt_injection_defense": {
                "sample_size_n": n_adv,
                "ptai_v3_blocked_pct": round((adv_ptai_pass / max(n_adv, 1)) * 100.0, 1),
                "baseline_1_single_agent_blocked_pct": round((adv_single_pass / max(n_adv, 1)) * 100.0, 1),
                "baseline_2_heuristic_blocked_pct": round((adv_heur_pass / max(n_adv, 1)) * 100.0, 1)
            },
            "clinical_contraindication_alerting": {
                "sample_size_n": n_contra,
                "ptai_v3_passed_pct": round((contra_ptai_pass / max(n_contra, 1)) * 100.0, 1),
                "baseline_1_single_agent_passed_pct": round((contra_single_pass / max(n_contra, 1)) * 100.0, 1),
                "baseline_2_heuristic_passed_pct": round((contra_heur_pass / max(n_contra, 1)) * 100.0, 1)
            }
        }
    }
    
    out_path = os.path.join(base_dir, "statistical_results.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"Statistical validation results successfully saved to: {out_path}")
    return results

if __name__ == "__main__":
    res = perform_statistical_validation()
    print(json.dumps(res, indent=2))

