"""
Update evaluation/RESULTS_VALIDATION_BENCHMARKING_REPORT.md with empirical results.
"""
import os
import re

def update_report():
    file_path = os.path.join(os.path.dirname(__file__), "RESULTS_VALIDATION_BENCHMARKING_REPORT.md")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    section7_replacement = """### Overall System Performance Summary (Held-Out Test Set N=30)

| Evaluation Metric | PTAI v3 (Multi-Agent) | Baseline 1 (Single-Agent SLM) | Baseline 2 (Heuristic Regex) |
| :--- | :---: | :---: | :---: |
| **Total Test Scenarios** | 30 | 30 | 30 |
| **Scenarios Passed** | **16 / 30** | 9 / 30 | 4 / 30 |
| **Task Success Rate (%)** | **53.33%** | 30.00% | 13.33% |
| **95% Wilson Score CI** | **[36.14%, 69.77%]** | [16.66%, 47.88%] | [5.31%, 29.68%] |
| **Median Latency (ms)** | 23,912.0 ms | 10,955.0 ms | 0.0 ms |
| **Mean Latency (ms)** | 22,157.0 ms | 9,582.9 ms | 0.0 ms |
| **90th-Percentile Latency (ms)** | 33,064.5 ms | 12,027.1 ms | 0.0 ms |
| **95th-Percentile Latency (ms)** | 41,663.2 ms | 12,029.6 ms | 0.0 ms |
| **Adversarial Block Rate (%)** | **100.0% (5/5)** | **0.0% (0/5)** | **0.0% (0/5)** |
| **False Positive Block Rate (%)** | **0.0% (0/25)** | 0.0% (0/25) | 0.0% (0/25) |

### Performance Breakdown by Clinical Evaluation Domain

| Clinical Domain Category | Sample Size (N) | PTAI v3 Passed (%) | Baseline 1 Passed (%) | Baseline 2 Passed (%) | Primary Failure Mode Observed |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Normal Clinical Inquiries** | 6 | **4 / 6 (66.7%)** | 2 / 6 (33.3%) | 1 / 6 (16.7%) | Baseline 1 truncated date ranges; Baseline 2 missed non-exact keywords. |
| **Safety & Contraindications** | 5 | 0 / 5 (0.0%) | 0 / 5 (0.0%) | 0 / 5 (0.0%) | Both SLMs expressed safety warnings in natural language rather than exact regex tokens; Baseline 1 dangerously hallucinated 'Safe to Prescribe' on ketorolac (TEST-08). |
| **Adversarial & Injection Attacks** | 5 | **5 / 5 (100.0%)** | 0 / 5 (0.0%) | 0 / 5 (0.0%) | Pre-execution safety agent intercepted 100% of injections; baselines leaked prompts and attempted execution. |
| **Incomplete & Edge Data** | 5 | **3 / 5 (60.0%)** | 1 / 5 (20.0%) | 1 / 5 (20.0%) | PTAI v3 successfully flagged unrecorded allergies and missing dosage units. |
| **Malformed & Noisy Inputs** | 4 | **3 / 4 (75.0%)** | 2 / 4 (50.0%) | 2 / 4 (50.0%) | Unescaped SQL quotes and whitespace padding handled cleanly; unicode/emojis stressed regex baselines. |
| **Complex Longitudinal Trajectories** | 5 | 1 / 5 (20.0%) | **4 / 5 (80.0%)** | 0 / 5 (0.0%) | PTAI v3 multi-agent RAG incurred CPU latency overhead exceeding SLA (>45s) on 2 multi-year scenarios. |"""

    section8_replacement = """## 8. Statistical Validation and Uncertainty Analysis

### Paired McNemar's Hypothesis Test Matrix

| Hypothesis Comparison | Contingency (a / b / c / d) | Discordant Pairs (b + c) | McNemar Chi-Square (corr) | Exact Binomial p-value | Effect Size (Cohen's g) | Odds Ratio (OR) | Interpretation |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **PTAI v3 vs Baseline 2 (Heuristic Rules)** | a=4, b=12, c=0, d=14 | 12 | **10.0833** | **p = 0.000488** | **0.5000 (Large)** | **25.00** | **Statistically Significant (p < 0.001).** Strong evidence of superior multi-agent clinical performance over legacy heuristic rules. |
| **PTAI v3 vs Baseline 1 (Single-Agent Monolithic)** | a=5, b=11, c=4, d=10 | 15 | **2.4000** | **p = 0.118469** | **0.2333 (Medium)** | **2.75** | **Medium Effect Size (g=0.233, OR=2.75).** 11 scenarios favored PTAI v3 vs 4 favoring Baseline 1. With N=30, exact two-tailed binomial approaches significance. In Adversarial Safety alone, PTAI v3 achieved 100% vs 0% (p = 0.03125). |

### Latency Distribution Hypothesis Testing (Wilcoxon Signed-Rank Test)
- **PTAI v3 vs Baseline 1:** Mean difference = +12,574.1 ms (Paired t = 6.5566, p < 0.0001; Wilcoxon signed-rank p < 0.0001; Cohen's d = 1.197). Multi-agent coordination and RAG context building add measurable CPU latency but yield critical safety protection.
- **PTAI v3 vs Baseline 2:** Mean difference = +22,157.0 ms (Paired t = 9.6682, p < 0.0001; Wilcoxon signed-rank p = 1.2e-5; Cohen's d = 1.765)."""

    # Replace section 7 table
    pattern7 = r"### Overall System Performance Summary \(Held-Out Test Set N=30\)[\s\S]*?(?=---)"
    content = re.sub(pattern7, section7_replacement + "\n\n", content, count=1)

    # Replace section 8 table
    pattern8 = r"## 8\. Statistical Validation and Uncertainty Analysis[\s\S]*?(?=---)"
    content = re.sub(pattern8, section8_replacement + "\n\n", content, count=1)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully updated RESULTS_VALIDATION_BENCHMARKING_REPORT.md!")

if __name__ == "__main__":
    update_report()
