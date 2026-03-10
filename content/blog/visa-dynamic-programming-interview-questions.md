---
title: "Dynamic Programming Questions at Visa: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Visa — patterns, difficulty breakdown, and study tips."
date: "2028-03-31"
category: "dsa-patterns"
tags: ["visa", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Visa isn't just another algorithm topic—it's a critical filter. With 19 DP problems in their tagged list (over 15% of their total), it's a core focus area. In real interviews, especially for mid-to-senior backend and payments infrastructure roles, you are highly likely to encounter at least one medium-to-hard DP question. Why? Visa's systems handle authorization, clearing, settlement, and fraud detection—all domains where optimal decision-making over sequences (transactions, time windows, resource allocation) is paramount. A candidate who can't reason about overlapping subproblems and optimal substructure might struggle with designing efficient financial logic.

## Specific Patterns Visa Favors

Visa's DP problems skew heavily toward **classic one-dimensional and two-dimensional iterative DP** with a strong emphasis on **knapsack variants** and **string/sequence manipulation**. You won't find many exotic graph DP or digit DP problems here. Their focus is on practical, pattern-based problems that test your ability to model a business constraint (like a budget, a sequence of transactions, or a scheduling conflict) into a tabulation or memoization formula.

The most frequent patterns are:

1.  **0/1 Knapsack & Unbounded Knapsack:** Modeling resource allocation, budget constraints, or selection problems. Think "maximum value with a weight limit" or "number of ways to make a sum."
2.  **Longest Common Subsequence (LCS) & String DP:** For comparing transaction sequences, audit trails, or message formats.
3.  **DP on Intervals or Sequences:** Problems where the decision is how to partition or process a sequence optimally.

Specific LeetCode problems that mirror Visa's style include **Coin Change (#322)** (unbounded knapsack), **Target Sum (#494)** (subset sum variant), **Longest Increasing Subsequence (#300)**, **Edit Distance (#72)**, and **Partition Equal Subset Sum (#416)**.

## How to Prepare

The key is to internalize the state definition and transition. For Visa, you must be fluent in **iterative bottom-up tabulation**. Recursive top-down with memoization is acceptable, but the iterative approach often leads to more obvious space optimization and is preferred in performance-critical contexts. Let's examine the most common pattern: the 0/1 Knapsack.

The core idea: `dp[i][w]` represents the maximum value achievable using the first `i` items with a weight limit `w`. The transition is: either you don't take item `i-1` (`dp[i-1][w]`), or you do take it (`value[i-1] + dp[i-1][w - weight[i-1]]`).

<div class="code-group">

```python
def knapsack_01(weights, values, capacity):
    """
    Classic 0/1 Knapsack. Returns maximum value.
    Time: O(n * capacity) | Space: O(n * capacity)
    """
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] > w:
                # Current item too heavy, skip it
                dp[i][w] = dp[i-1][w]
            else:
                # Max of skipping or taking the item
                dp[i][w] = max(
                    dp[i-1][w],
                    values[i-1] + dp[i-1][w - weights[i-1]]
                )
    return dp[n][capacity]

# Space-optimized version (common follow-up)
def knapsack_01_optimized(weights, values, capacity):
    """
    Space-optimized using 1D array.
    Time: O(n * capacity) | Space: O(capacity)
    """
    dp = [0] * (capacity + 1)
    for i in range(len(weights)):
        # Traverse backwards to prevent re-using the same item
        for w in range(capacity, weights[i] - 1, -1):
            dp[w] = max(dp[w], values[i] + dp[w - weights[i]])
    return dp[capacity]
```

```javascript
function knapsack01(weights, values, capacity) {
  // Time: O(n * capacity) | Space: O(n * capacity)
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      }
    }
  }
  return dp[n][capacity];
}

// Space-optimized version
function knapsack01Optimized(weights, values, capacity) {
  // Time: O(n * capacity) | Space: O(capacity)
  const dp = new Array(capacity + 1).fill(0);
  for (let i = 0; i < weights.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
  }
  return dp[capacity];
}
```

```java
public class Knapsack {
    public int knapsack01(int[] weights, int[] values, int capacity) {
        // Time: O(n * capacity) | Space: O(n * capacity)
        int n = weights.length;
        int[][] dp = new int[n + 1][capacity + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 1; w <= capacity; w++) {
                if (weights[i - 1] > w) {
                    dp[i][w] = dp[i - 1][w];
                } else {
                    dp[i][w] = Math.max(
                        dp[i - 1][w],
                        values[i - 1] + dp[i - 1][w - weights[i - 1]]
                    );
                }
            }
        }
        return dp[n][capacity];
    }

    public int knapsack01Optimized(int[] weights, int[] values, int capacity) {
        // Time: O(n * capacity) | Space: O(capacity)
        int[] dp = new int[capacity + 1];
        for (int i = 0; i < weights.length; i++) {
            for (int w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
            }
        }
        return dp[capacity];
    }
}
```

</div>

The second most critical pattern is **String DP**, often involving a comparison. The state is typically `dp[i][j]` representing the result for prefixes `s1[0..i-1]` and `s2[0..j-1]`.

<div class="code-group">

```python
def longest_common_subsequence(text1, text2):
    """
    Classic LCS. Returns length of longest common subsequence.
    Time: O(m * n) | Space: O(m * n)
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = 1 + dp[i-1][j-1]
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```

```javascript
function longestCommonSubsequence(text1, text2) {
  // Time: O(m * n) | Space: O(m * n)
  const m = text1.length,
    n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}
```

```java
public class LCS {
    public int longestCommonSubsequence(String text1, String text2) {
        // Time: O(m * n) | Space: O(m * n)
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i-1) == text2.charAt(j-1)) {
                    dp[i][j] = 1 + dp[i-1][j-1];
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                }
            }
        }
        return dp[m][n];
    }
}
```

</div>

## How Visa Tests Dynamic Programming vs Other Companies

Compared to Google or Meta, Visa's DP questions are less about clever "aha!" moments and more about **disciplined application of known patterns to a slightly novel scenario**. At a company like Google, you might get a DP problem disguised as a game or a unique array transformation. At Visa, the problem statement will often directly suggest a DP approach (e.g., "find the minimum number of coins," "determine if the array can be partitioned"). The unique aspect is the **follow-up**. After you code the standard solution, be prepared to:

1.  **Optimize space** (as shown in the knapsack example).
2.  **Modify the problem** slightly (e.g., "what if we have a transaction fee?" turning a standard problem into a variant with a small twist).
3.  **Discuss real-world applicability**—they may ask how this algorithm relates to batch processing or fraud rule matching.

The difficulty is consistently in the LeetCode Medium range, with an occasional Hard. The expectation is clean, bug-free, and well-explained code for the core pattern.

## Study Order

Don't jump into the hardest problems. Build your intuition sequentially.

1.  **Foundation: Fibonacci & Climbing Stairs (#70).** Understand overlapping subproblems and the difference between top-down (memoization) and bottom-up.
2.  **1D DP: Knapsack Core.** Master the 0/1 Knapsack logic and its space-optimized form. This is the single most important pattern.
3.  **1D DP: Unbounded Knapsack.** Learn Coin Change (#322) and how the inner loop order changes from 0/1.
4.  **2D DP: String Comparison.** Practice LCS and Edit Distance (#72). This teaches you to define state for two sequences.
5.  **2D DP: Sequence/Interval.** Tackle Longest Increasing Subsequence (#300) and Matrix Chain Multiplication concepts.
6.  **Variants & Twists.** Finally, handle problems that combine patterns, like Target Sum (#494) (knapsack with a math twist) or Partition Equal Subset Sum (#416) (0/1 knapsack decision problem).

## Recommended Practice Order

Solve these Visa-tagged or style-similar problems in this sequence:

1.  Climbing Stairs (#70) - Warm-up
2.  Coin Change (#322) - Unbounded Knapsack
3.  Partition Equal Subset Sum (#416) - 0/1 Knapsack decision
4.  Target Sum (#494) - Knapsack variant
5.  Longest Increasing Subsequence (#300) - 1D/2D hybrid
6.  Longest Common Subsequence (#1143) - String DP core
7.  Edit Distance (#72) - String DP application
8.  Word Break (#139) - Knapsack on a dictionary
9.  Decode Ways (#91) - 1D DP with conditions

This progression builds from simple state transitions to more complex ones, ensuring you reinforce the knapsack and string patterns before combining them.

[Practice Dynamic Programming at Visa](/company/visa/dynamic-programming)
