---
title: "Dynamic Programming Questions at Myntra: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Myntra — patterns, difficulty breakdown, and study tips."
date: "2031-05-03"
category: "dsa-patterns"
tags: ["myntra", "dynamic-programming", "interview prep"]
---

Dynamic Programming (DP) is a core algorithmic technique for optimizing solutions to complex problems by breaking them down into simpler overlapping subproblems. At Myntra, a leading fashion e-commerce platform, DP is not just an academic exercise. It’s directly applicable to real-world challenges in their tech stack, such as optimizing recommendation engines, managing inventory allocation, personalizing user experiences, and solving complex logistics and pricing problems. With 5 out of 24 total coding questions often focused on DP, mastering it is crucial for passing their technical interviews. It demonstrates your ability to think about efficiency and optimal solutions at scale—a key requirement for building high-performance systems that handle millions of users.

## What to Expect — Types of Problems

Myntra's DP questions typically fall into a few predictable categories. You won't see overly obscure problems; instead, expect classic patterns applied with a potential twist relevant to e-commerce or general software engineering.

1.  **Knapsack & Variants:** This is a top pattern. Problems may involve resource allocation, like bundling fashion items for a promotion within a budget (0/1 Knapsack) or selecting unlimited accessories to maximize style points (Unbounded Knapsack).
2.  **String/Sequence DP:** Common problems include finding the longest common subsequence (useful in comparing user preferences or product catalogs), edit distance (relevant for search query correction), and palindromic substrings.
3.  **Grid & Path Finding:** Questions about finding unique or optimal paths in a grid, often with obstacles or costs. This can model navigation in a warehouse layout or workflow optimization.
4.  **DP on Intervals or Trees:** While slightly more advanced, these can appear for senior roles, involving problems like matrix chain multiplication (optimization) or tree DP for hierarchical data structures.

The key is to recognize the underlying pattern from the problem statement. The context might be about "styles," "bundles," or "discounts," but the core algorithm will be a standard DP approach.

## How to Prepare — Study Tips with Code Example

Start by solidifying the core concept: DP is used when a problem has **optimal substructure** (an optimal solution can be constructed from optimal solutions of its subproblems) and **overlapping subproblems**. The two main implementation approaches are:

- **Top-Down (Memoization):** Recursive solution that caches results.
- **Bottom-Up (Tabulation):** Iterative solution that builds a DP table.

Practice identifying the state definition (`dp[i]` or `dp[i][j]` represents what?), the recurrence relation (how does state `i` relate to states `i-1`, `i-2`, etc.?), and the base cases.

A fundamental example is the **Fibonacci sequence**, which perfectly illustrates overlapping subproblems. Here is the pattern implemented with memoization:

<div class="code-group">

```python
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]
```

```javascript
function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}
```

```java
import java.util.HashMap;

public class Solution {
    public int fib(int n) {
        HashMap<Integer, Integer> memo = new HashMap<>();
        return fibHelper(n, memo);
    }

    private int fibHelper(int n, HashMap<Integer, Integer> memo) {
        if (memo.containsKey(n)) return memo.get(n);
        if (n <= 1) return n;
        int result = fibHelper(n-1, memo) + fibHelper(n-2, memo);
        memo.put(n, result);
        return result;
    }
}
```

</div>

## Recommended Practice Order

Do not jump into hard problems. Build competence systematically:

1.  **Foundations:** Fibonacci, Climbing Stairs. Understand memoization vs. tabulation.
2.  **1D DP:** House Robber, Min Cost Climbing Stairs. Master defining `dp[i]`.
3.  **Classic Knapsack:** 0/1 Knapsack, Subset Sum. Learn to handle decisions (include/exclude).
4.  **2D DP for Strings:** Longest Common Subsequence, Edit Distance.
5.  **Grid DP:** Unique Paths, Minimum Path Sum.
6.  **Unbounded Knapsack:** Coin Change (number of ways, fewest coins).
7.  **Myntra-Focused Practice:** Apply these patterns to problems tagged for Myntra or similar companies.

Focus on deriving the recurrence relation yourself before looking at solutions. Draw the state tree, identify the overlap, and then code both the top-down and bottom-up versions.

[Practice Dynamic Programming at Myntra](/company/myntra/dynamic-programming)
