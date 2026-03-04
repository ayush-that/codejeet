---
title: "Dynamic Programming Questions at American Express: What to Expect"
description: "Prepare for Dynamic Programming interview questions at American Express — patterns, difficulty breakdown, and study tips."
date: "2031-03-28"
category: "dsa-patterns"
tags: ["american-express", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a core algorithmic technique for optimizing solutions to complex problems by breaking them into overlapping subproblems. At American Express, which processes millions of transactions daily, DP is directly relevant to optimizing routing, fraud detection logic, and resource allocation in financial systems. While their technical interviews typically include 2 DP questions out of approximately 24 total problems, these questions are often weighted heavily. Success here demonstrates not just coding skill, but the analytical rigor needed to design efficient, scalable solutions—a critical competency for engineers building Amex's global payments infrastructure.

## What to Expect — Types of Problems

You will not encounter overly obscure DP problems. The focus is on practical applications and foundational patterns. Expect variations on these core categories:

1.  **One-Dimensional DP:** Classic problems like the Fibonacci sequence, climbing stairs, or house robber. These test your understanding of state definition and recurrence relations.
2.  **Knapsack/Subset Problems:** Problems involving making optimal selections given a constraint, such as subset sum or partition equal subset sum. These model real-world scenarios like budget allocation or feature flag optimization.
3.  **String/Sequence DP:** Problems like longest common subsequence (LCS) or edit distance. These are highly relevant to data processing, transaction matching, and text analysis tasks.
4.  **Grid/Matrix DP:** Finding minimum path sums in a grid or counting unique paths. This pattern applies to optimization problems in network routing or risk matrix analysis.

The problems will often be framed within a business context, but the underlying DP pattern will be a standard one. Your task is to recognize the pattern and implement an efficient solution.

## How to Prepare — Study Tips with One Code Example

Start by mastering the core theory: optimal substructure and overlapping subproblems. Then, practice the two fundamental implementation approaches:

- **Top-Down (Memoization):** Recursive solution that caches results of subproblems.
- **Bottom-Up (Tabulation):** Iterative solution that builds a DP table from the base cases up.

For most interviews, the bottom-up approach is preferred for its clear structure and avoidance of recursion stack limits. A key pattern to internalize is the "DP array" for one-dimensional problems.

Consider the classic "Climbing Stairs" problem: You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. How many distinct ways can you climb to the top?

The recurrence relation is: `dp[i] = dp[i-1] + dp[i-2]`, where `dp[i]` represents the number of ways to reach step `i`.

<div class="code-group">

```python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# Space-optimized version (often a follow-up)
def climbStairsOptimized(n: int) -> int:
    if n <= 2:
        return n
    prev1, prev2 = 2, 1  # ways for i-1 and i-2
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    return prev1
```

```javascript
function climbStairs(n) {
  if (n <= 2) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// Space-optimized version
function climbStairsOptimized(n) {
  if (n <= 2) return n;
  let prev1 = 2,
    prev2 = 1;
  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}
```

```java
public int climbStairs(int n) {
    if (n <= 2) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

// Space-optimized version
public int climbStairsOptimized(int n) {
    if (n <= 2) return n;
    int prev1 = 2, prev2 = 1;
    for (int i = 3; i <= n; i++) {
        int current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    return prev1;
}
```

</div>

## Recommended Practice Order

Do not jump into hard problems. Build competence systematically:

1.  **Foundations:** Master Fibonacci, Climbing Stairs, and Min Cost Climbing Stairs. Focus on writing both top-down and bottom-up solutions.
2.  **1D & Knapsack:** Practice House Robber, Partition Equal Subset Sum, and Coin Change. Understand the difference between problems on a sequence versus selection problems.
3.  **2D & Strings:** Solve Longest Common Subsequence, Edit Distance, and Unique Paths. Practice drawing the DP table to visualize the state transition.
4.  **Amex-Specific Practice:** Finally, work on problems tagged for American Express to familiarize yourself with their problem style and constraints.

Always analyze the time and space complexity of your solution and be prepared to discuss optimizations, like the space-optimized version shown above.

[Practice Dynamic Programming at American Express](/company/american-express/dynamic-programming)
