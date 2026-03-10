---
title: "Dynamic Programming Questions at Agoda: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Agoda — patterns, difficulty breakdown, and study tips."
date: "2029-09-12"
category: "dsa-patterns"
tags: ["agoda", "dynamic-programming", "interview prep"]
---

Agoda’s interview process is known for being algorithmically rigorous, with a clear emphasis on dynamic programming (DP). Out of their 46 total coding questions, 10 are DP problems—that’s nearly 22% of their problem bank. This isn’t a coincidence. Agoda, as a global travel platform, deals heavily with optimization problems: pricing algorithms, route optimization, inventory management, and scheduling. These real-world systems often boil down to maximizing value, minimizing cost, or finding the most efficient sequence—classic domains for dynamic programming. In interviews, DP isn't just a secondary topic to check your algorithmic knowledge; it's a primary filter for candidates who can think in terms of state, transitions, and optimal substructure. If you're interviewing for a backend, data, or full-stack role at Agoda, you should expect at least one DP question in your technical rounds, often as the main problem to solve in 45 minutes.

## Specific Patterns Agoda Favors

Agoda's DP questions tend to cluster around a few practical patterns rather than obscure theoretical puzzles. They heavily favor **iterative, bottom-up tabulation** over recursive memoization. This makes sense for an engineering culture focused on performance and clear, scalable code. The most common themes are:

1.  **One-Dimensional DP for Sequence Decisions:** Problems where you make a series of choices (like taking or skipping elements) to maximize a value or meet a target. Think "House Robber" or "Coin Change."
2.  **Two-Dimensional DP for String/Sequence Comparison:** This is their most frequent pattern. It's directly applicable to text processing, data matching, and similarity algorithms—core to travel search. You'll see many variations of the **Longest Common Subsequence (LCS)** and **Edit Distance** problem families.
3.  **Bounded Knapsack-style Problems:** Problems about selecting items with weights/values under a constraint. This maps to resource allocation scenarios.

For example, **Edit Distance (#72)** is a quintessential Agoda-style problem. It's a 2D DP with clear real-world analogs (fuzzy matching user-entered destination names). **Coin Change (#322)** is another favorite, testing your ability to model a minimization problem with a 1D DP array.

## How to Prepare

The key to Agoda's DP is not just knowing the pattern but being able to derive the state transition on the spot. Start by internalizing the framework for 2D string DP, as it's their most tested pattern.

**The 2D String DP Template:** For problems where you compare or transform two sequences (`str1` and `str2`), you almost always define `dp[i][j]` as the answer for the subproblems `str1[0:i]` and `str2[0:j]`. The recurrence relation then depends on whether the current characters match.

Let's look at the **Longest Common Subsequence** pattern. The core insight: if characters match, the LCS grows from the previous subproblem. If they don't, we take the best result from ignoring a character in either string.

<div class="code-group">

```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    # dp[i][j]: LCS length for text1[:i] and text2[:j]
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                # Characters match, extend the LCS from the diagonal
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                # Take the best of skipping a char in text1 or text2
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
# Time: O(m*n) | Space: O(m*n)
```

```javascript
function longestCommonSubsequence(text1, text2) {
  const m = text1.length,
    n = text2.length;
  // dp[i][j]: LCS length for text1[0..i-1] and text2[0..j-1]
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}
// Time: O(m*n) | Space: O(m*n)
```

```java
public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    // dp[i][j]: LCS length for text1[0..i-1] and text2[0..j-1]
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i-1) == text2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[m][n];
}
// Time: O(m*n) | Space: O(m*n)
```

</div>

For 1D DP problems like **Coin Change**, the pattern shifts to iterating over the amount and trying each coin.

<div class="code-group">

```python
def coinChange(coins: List[int], amount: int) -> int:
    # dp[a]: min coins to make amount `a`
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins to make amount 0

    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
# Time: O(amount * len(coins)) | Space: O(amount)
```

```javascript
function coinChange(coins, amount) {
  // dp[a]: min coins to make amount `a`
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a) {
        dp[a] = Math.min(dp[a], dp[a - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
// Time: O(amount * coins.length) | Space: O(amount)
```

```java
public int coinChange(int[] coins, int amount) {
    // dp[a]: min coins to make amount `a`
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // Use a value > any possible answer
    dp[0] = 0;

    for (int a = 1; a <= amount; a++) {
        for (int coin : coins) {
            if (coin <= a) {
                dp[a] = Math.min(dp[a], dp[a - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
// Time: O(amount * coins.length) | Space: O(amount)
```

</div>

## How Agoda Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, Agoda's DP questions are less about clever "aha!" moments and more about clean, correct implementation of standard patterns. At Google or Meta, you might get a DP problem disguised as a graph or array problem, requiring significant insight to even identify the DP state. At Agoda, the DP nature is usually more apparent, but the expectation for bug-free, optimal code is high.

The unique aspect is the **practical framing**. While a FAANG company might ask "Minimum Path Sum" in an abstract grid, Agoda might contextualize it as "minimizing the cost of connecting flight segments." The core algorithm is the same, but they appreciate candidates who can listen to the story, map it to a known pattern, and then implement it precisely. They test for **robustness**—does your solution handle edge cases? Is your space complexity optimized (e.g., from O(m\*n) to O(n)) if asked? Be prepared to discuss trade-offs.

## Study Order

Tackle DP in this logical sequence to build a solid foundation:

1.  **1D DP - Fibonacci Style:** Start with the simplest recurrence (Climbing Stairs, Fibonacci). This teaches you the core concept of state, recurrence, and memoization vs. tabulation.
2.  **1D DP - Sequence Decisions:** Move to problems where each step involves a choice (House Robber, Coin Change). This introduces the concept of the "take or skip" decision.
3.  **2D DP - String Comparison:** This is the most critical block for Agoda. Master LCS and Edit Distance. Learn how the 2D table is built and how the recurrence changes based on the problem (min vs. max, match vs. mismatch).
4.  **2D DP - Grid Paths:** Problems like Unique Paths and Minimum Path Sum. These are simpler 2D DP problems that reinforce the idea of building a table from smaller subproblems.
5.  **Knapsack Variants:** Study the 0/1 Knapsack and Unbounded Knapsack (Coin Change is one) patterns. Understand how to model weight/value and capacity.
6.  **Advanced Patterns (Optional):** Interval DP (Matrix Chain Multiplication) or DP on trees. These are less common at Agoda but good for completeness.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous pattern.

1.  **Climbing Stairs (#70)** - The "Hello World" of DP.
2.  **House Robber (#198)** - Classic 1D sequence decision.
3.  **Coin Change (#322)** - 1D minimization, unbounded knapsack.
4.  **Longest Common Subsequence (#1143)** - Master the 2D string DP template.
5.  **Edit Distance (#72)** - Apply the 2D template to a minimization problem.
6.  **Unique Paths (#62)** - Simple 2D grid DP.
7.  **0/1 Knapsack (LeetCode 416 - Partition Equal Subset Sum)** - Understand the classic selection DP.
8.  **Decode Ways (#91)** - A trickier 1D DP that tests careful state definition.
9.  **Longest Increasing Subsequence (#300)** - Introduces a different O(n²) pattern and the O(n log n) optimization.
10. **Word Break (#139)** - A good blend of string handling and DP, testing if you can identify the state (segmentable up to index i).

Focus on writing the bottom-up iterative solution for each, and practice explaining your state definition and transition relation out loud. For Agoda, a correct, well-explained implementation of a medium-difficulty DP problem like Edit Distance will often be more than enough to pass the technical screen.

[Practice Dynamic Programming at Agoda](/company/agoda/dynamic-programming)
