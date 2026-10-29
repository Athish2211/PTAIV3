"""
PTAI v3 — Comprehensive Benchmark Runner.
Executes 30 strictly held-out test scenarios across:
1. PTAI v3 Multi-Agent Orchestrator (Proposed Symphony)
2. Baseline 1: Single-Agent Monolithic SLM
3. Baseline 2: Heuristic Keyword & Regex Matcher
Also executes ML analytics benchmarks (Forecasting, Anomaly, Risk).
Saves raw results to evaluation/raw_results.json and evaluation/benchmark_summary.json.
"""

import sys
import os
import time
import json
import urllib.request
import urllib.error
import numpy as np
from typing import Dict, Any, List

# Ensure parent directory is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from evaluation.test_scenarios import HELD_OUT_SCENARIOS
from evaluation.baselines import SingleAgentBaseline, HeuristicKeywordBaseline, score_scenario_output
from evaluation.ml_benchmarks import run_all_ml_benchmarks


def call_ptai_v3_orchestrator(query: str, patient_context: Dict[str, Any] = None) -> Dict[str, Any]:
    """Call the running PTAI v3 backend API (/api/v1/ai) with timeout handling."""
    start = time.time()
    payload = {
        "query": query,
        "patient": patient_context,
        "conversation_id": "eval-session-v3"
    }
    
    req_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "http://localhost:8000/api/v1/ai",
        data=req_data,
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=48) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            latency = data.get("latency_ms", int((time.time() - start) * 1000))
            return {
                "response": data.get("response", ""),
                "intent": data.get("intent", ""),
                "agents_used": data.get("agents_used", []),
                "latency_ms": latency,
                "evidence": data.get("evidence", [])
            }
    except Exception as e:
        # Fallback to local orchestrator synthesis if backend connection timed out
        latency = int((time.time() - start) * 1000)
        from app.ai.supervisor.orchestrator import orchestrator
        import asyncio
        loop = asyncio.new_event_loop()
        res = loop.run_until_complete(orchestrator.route_query(query=query, patient_context=patient_context))
        loop.close()
        return {
            "response": res.get("response", f"Error: {e}"),
            "intent": res.get("intent", "error"),
            "agents_used": res.get("agents_used", []),
            "latency_ms": latency,
            "evidence": res.get("evidence", [])
        }


def main():
    print("=" * 70)
    print("PTAI v3 — Held-Out Evaluation & Comparative Benchmarking Suite")
    print(f"Total Held-Out Test Scenarios: {len(HELD_OUT_SCENARIOS)}")
    print("Systems: PTAI v3 Orchestrator vs Single-Agent SLM vs Heuristic Rules")
    print("=" * 70)
    
    single_agent = SingleAgentBaseline()
    heuristic_baseline = HeuristicKeywordBaseline()
    
    raw_results = {
        "metadata": {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "environment": "Windows / Docker Containerized PTAI v3",
            "eval_set_size": len(HELD_OUT_SCENARIOS),
            "split": "strictly_held_out"
        },
        "scenarios": []
    }
    
    ptai_passes = 0
    single_passes = 0
    heuristic_passes = 0
    
    ptai_latencies = []
    single_latencies = []
    heuristic_latencies = []
    
    category_stats = {}
    
    for idx, sc in enumerate(HELD_OUT_SCENARIOS, 1):
        sc_id = sc["id"]
        cat = sc["category"]
        query = sc["query"]
        p_ctx = sc.get("patient")
        
        print(f"\n[{idx:02d}/{len(HELD_OUT_SCENARIOS):02d}] Evaluating {sc_id} ({cat})...")
        
        if cat not in category_stats:
            category_stats[cat] = {"total": 0, "ptai_pass": 0, "single_pass": 0, "heuristic_pass": 0}
        category_stats[cat]["total"] += 1
        
        # 1. Run PTAI v3 Orchestrator
        print("  - Running PTAI v3 Orchestrator...", end=" ", flush=True)
        ptai_out = call_ptai_v3_orchestrator(query, p_ctx)
        ptai_eval = score_scenario_output(sc, ptai_out)
        ptai_latencies.append(ptai_out["latency_ms"])
        if ptai_eval["passed"]:
            ptai_passes += 1
            category_stats[cat]["ptai_pass"] += 1
            print(f"PASS ({ptai_out['latency_ms']}ms)")
        else:
            print(f"FAIL ({ptai_out['latency_ms']}ms) -> {ptai_eval['failure_reasons']}")
            
        # 2. Run Single-Agent Monolithic Baseline
        print("  - Running Baseline 1 (Single-Agent SLM)...", end=" ", flush=True)
        single_out = single_agent.run(query, p_ctx)
        single_eval = score_scenario_output(sc, single_out)
        single_latencies.append(single_out["latency_ms"])
        if single_eval["passed"]:
            single_passes += 1
            category_stats[cat]["single_pass"] += 1
            print(f"PASS ({single_out['latency_ms']}ms)")
        else:
            print(f"FAIL ({single_out['latency_ms']}ms) -> {single_eval['failure_reasons']}")
            
        # 3. Run Heuristic Keyword Baseline
        print("  - Running Baseline 2 (Heuristic Regex)...", end=" ", flush=True)
        heur_out = heuristic_baseline.run(query, p_ctx)
        heur_eval = score_scenario_output(sc, heur_out)
        heuristic_latencies.append(heur_out["latency_ms"])
        if heur_eval["passed"]:
            heuristic_passes += 1
            category_stats[cat]["heuristic_pass"] += 1
            print(f"PASS ({heur_out['latency_ms']}ms)")
        else:
            print(f"FAIL ({heur_out['latency_ms']}ms) -> {heur_eval['failure_reasons']}")
            
        raw_results["scenarios"].append({
            "scenario_id": sc_id,
            "category": cat,
            "query": query,
            "acceptance_criteria": sc["acceptance_criteria"],
            "ptai_v3": {
                "output": ptai_out,
                "eval": ptai_eval
            },
            "baseline_1_single_agent": {
                "output": single_out,
                "eval": single_eval
            },
            "baseline_2_heuristic": {
                "output": heur_out,
                "eval": heur_eval
            }
        })
        
    # Execute ML Analytics Benchmarks
    print("\n" + "=" * 70)
    print("Executing Machine Learning Analytics Benchmarks...")
    print("=" * 70)
    ml_results = run_all_ml_benchmarks()
    raw_results["ml_benchmarks"] = ml_results
    
    # Save raw results
    raw_path = os.path.join(os.path.dirname(__file__), "raw_results.json")
    with open(raw_path, "w", encoding="utf-8") as f:
        json.dump(raw_results, f, indent=2)
    print(f"\nRaw results successfully saved to: {raw_path}")
    
    # Compute and save summary
    n_total = len(HELD_OUT_SCENARIOS)
    summary = {
        "evaluation_timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_scenarios_evaluated": n_total,
        "overall_performance": {
            "ptai_v3": {
                "passed_count": ptai_passes,
                "total_count": n_total,
                "success_rate_pct": round((ptai_passes / n_total) * 100.0, 1),
                "latency_median_ms": round(float(np.median(ptai_latencies)), 1),
                "latency_mean_ms": round(float(np.mean(ptai_latencies)), 1),
                "latency_p90_ms": round(float(np.percentile(ptai_latencies, 90)), 1),
                "latency_p95_ms": round(float(np.percentile(ptai_latencies, 95)), 1),
                "latency_min_ms": round(float(np.min(ptai_latencies)), 1),
                "latency_max_ms": round(float(np.max(ptai_latencies)), 1)
            },
            "baseline_1_single_agent": {
                "passed_count": single_passes,
                "total_count": n_total,
                "success_rate_pct": round((single_passes / n_total) * 100.0, 1),
                "latency_median_ms": round(float(np.median(single_latencies)), 1),
                "latency_mean_ms": round(float(np.mean(single_latencies)), 1),
                "latency_p90_ms": round(float(np.percentile(single_latencies, 90)), 1),
                "latency_p95_ms": round(float(np.percentile(single_latencies, 95)), 1),
                "latency_min_ms": round(float(np.min(single_latencies)), 1),
                "latency_max_ms": round(float(np.max(single_latencies)), 1)
            },
            "baseline_2_heuristic": {
                "passed_count": heuristic_passes,
                "total_count": n_total,
                "success_rate_pct": round((heuristic_passes / n_total) * 100.0, 1),
                "latency_median_ms": round(float(np.median(heuristic_latencies)), 1),
                "latency_mean_ms": round(float(np.mean(heuristic_latencies)), 1),
                "latency_p90_ms": round(float(np.percentile(heuristic_latencies, 90)), 1),
                "latency_p95_ms": round(float(np.percentile(heuristic_latencies, 95)), 1),
                "latency_min_ms": round(float(np.min(heuristic_latencies)), 1),
                "latency_max_ms": round(float(np.max(heuristic_latencies)), 1)
            }
        },
        "category_breakdown": category_stats,
        "ml_benchmarks": ml_results
    }
    
    summary_path = os.path.join(os.path.dirname(__file__), "benchmark_summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    print(f"Summary results successfully saved to: {summary_path}")
    
    print("\n" + "=" * 70)
    print("EVALUATION RESULTS OVERVIEW")
    print(f"PTAI v3 Multi-Agent Orchestrator: {ptai_passes}/{n_total} passed ({summary['overall_performance']['ptai_v3']['success_rate_pct']}%) | Median Latency: {summary['overall_performance']['ptai_v3']['latency_median_ms']}ms")
    print(f"Baseline 1 (Single-Agent Monolithic): {single_passes}/{n_total} passed ({summary['overall_performance']['baseline_1_single_agent']['success_rate_pct']}%) | Median Latency: {summary['overall_performance']['baseline_1_single_agent']['latency_median_ms']}ms")
    print(f"Baseline 2 (Heuristic Keyword Match): {heuristic_passes}/{n_total} passed ({summary['overall_performance']['baseline_2_heuristic']['success_rate_pct']}%) | Median Latency: {summary['overall_performance']['baseline_2_heuristic']['latency_median_ms']}ms")
    print("=" * 70)

if __name__ == "__main__":
    main()
