---
title: "Dynamic Programming Questions at Paytm: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Paytm — patterns, difficulty breakdown, and study tips."
date: "2030-10-21"
category: "dsa-patterns"
tags: ["paytm", "dynamic-programming", "interview prep"]
---

## Why Dynamic Programming Matters at Paytm

Paytm, as a fintech giant, builds systems that handle massive transaction volumes, complex payment routing, fraud detection, and algorithmic decision-making. Dynamic Programming (DP) isn't just an interview topic here—it's a practical tool for optimizing resource allocation, minimizing costs in payment networks, and solving sequence-based problems like transaction validation. With 6 out of 29 of their tagged problems being DP, that's roughly 20% of their technical focus. In real interviews, you're likely to encounter at least one DP question in the onsite rounds, often disguised as a real-world optimization problem. They don't ask DP to test academic knowledge; they use it to assess if you can break down a complex, stateful problem into efficient, overlapping subproblems—exactly what's needed when designing systems that scale under financial constraints.

## Specific Patterns Paytm Favors

Paytm's DP questions lean heavily toward **one-dimensional and two-dimensional iterative DP** with clear real-world analogs. You won't find many obscure combinatorial problems here. Instead, expect:

1. **String/Sequence DP**: Problems involving matching, transforming, or validating sequences—think transaction string validation or payment routing paths. "Edit Distance" (#72) and "Longest Common Subsequence" (#1143) are classic examples.
2. **Knapsack-style Optimization**: Resource allocation problems, like allocating server capacity or optimizing batch processing. "Coin Change" (#322) and "Partition Equal Subset Sum" (#416) appear frequently in their problem list.
3. **State Machine DP**: Problems where you move between defined states, useful for modeling transaction flows (e.g., valid/invalid states in a payment lifecycle). "Best Time to Buy and Sell Stock with Cooldown" (#309) is a prime example.

Noticeably absent are highly abstract graph DP problems (like "Floyd-Warshall") or tree DP. Their focus is on tabulation-based, iterative solutions that map cleanly to iterative system processes.

## How to Prepare

Master the iterative DP template. Start by identifying the **state definition** (what does `dp[i]` represent?), then the **base case** (what's the smallest subproblem?), followed by the **transition relation** (how do we build larger states from smaller ones?). Let's look at the "Coin Change" pattern, which is fundamental at Paytm.

<div class="code-group">

```python
# Time: O(amount * n) | Space: O(amount)
def coinChange(coins, amount):
    # dp[i] = min coins to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # base case: 0 coins needed for amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                # transition: use this coin or not
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Time: O(amount * n) | Space: O(amount)
function coinChange(coins, amount) {
  // dp[i] = min coins to make amount i
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0; // base case

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] !== Infinity ? dp[amount] : -1;
}
```

```java
// Time: O(amount * n) | Space: O(amount)
public int coinChange(int[] coins, int amount) {
    // dp[i] = min coins to make amount i
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);  // use a large number instead of infinity
    dp[0] = 0;  // base case

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

The pattern is consistent: a DP array, a base case, and a nested loop for transitions. Practice deriving this from scratch.

## How Paytm Tests Dynamic Programming vs Other Companies

At companies like Google or Meta, DP questions often involve clever optimizations (e.g., space reduction to O(1)) or combine with other domains (e.g., DP on trees). Paytm's approach is more pragmatic. Their DP problems are:

- **Less tricky**: You're unlikely to need obscure optimizations like the "divide and conquer" DP for matrix multiplication.
- **More iterative**: They prefer bottom-up tabulation over top-down memoization, reflecting their engineering culture of building up from base cases.
- **Contextualized**: Problems may be framed in financial terms—"minimum transactions to settle debts" or "maximizing profit from stock trades with transaction fees." The core pattern, however, remains a standard DP.

What's unique is their emphasis on **clarity and correctness over extreme optimization**. A clean, well-explained O(n²) solution is often better than a messy O(n) one. They want to see you structure the problem correctly first.

## Study Order

1. **1D DP (Fibonacci style)**: Start with "Climbing Stairs" (#70). It teaches state definition and simple transitions.
2. **1D DP with choices**: Move to "House Robber" (#198). Introduces the concept of making decisions at each state.
3. **Unbounded Knapsack**: Study "Coin Change" (#322). This is a core Paytm pattern for resource allocation.
4. **2D DP for sequences**: Tackle "Longest Common Subsequence" (#1143). Essential for string matching problems.
5. **2D DP with state machines**: Learn "Best Time to Buy and Sell Stock with Cooldown" (#309). Models real transaction flows.
6. **Partition DP**: Finally, attempt "Partition Equal Subset Sum" (#416). Combines knapsack with subset logic.

This order builds from simple state transitions to multi-dimensional decisions, mirroring how Paytm's problems increase in complexity.

## Recommended Practice Order

Solve these in sequence to build momentum:

1. Climbing Stairs (#70) – Basic 1D DP
2. House Robber (#198) – 1D DP with decisions
3. Coin Change (#322) – Unbounded knapsack (highly relevant)
4. Longest Increasing Subsequence (#300) – 1D DP with binary search optimization
5. Longest Common Subsequence (#1143) – 2D sequence DP
6. Edit Distance (#72) – 2D DP with string operations (Paytm favorite)
7. Partition Equal Subset Sum (#416) – Subset sum variation
8. Best Time to Buy and Sell Stock with Cooldown (#309) – State machine DP

Let's look at the "Edit Distance" pattern, another Paytm staple for string processing:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n)
def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    # dp[i][j] = min ops to convert word1[:i] to word2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # base cases: converting to/from empty string
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]  # characters match
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],    # delete
                    dp[i][j - 1],    # insert
                    dp[i - 1][j - 1] # replace
                )

    return dp[m][n]
```

```javascript
// Time: O(m * n) | Space: O(m * n)
function minDistance(word1, word2) {
  const m = word1.length,
    n = word2.length;
  // dp[i][j] = min ops to convert word1[0..i-1] to word2[0..j-1]
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // delete
            dp[i][j - 1], // insert
            dp[i - 1][j - 1] // replace
          );
      }
    }
  }

  return dp[m][n];
}
```

```java
// Time: O(m * n) | Space: O(m * n)
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    // dp[i][j] = min ops to convert word1[0..i-1] to word2[0..j-1]
    int[][] dp = new int[m + 1][n + 1];

    // base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i - 1][j],      // delete
                    Math.min(
                        dp[i][j - 1],  // insert
                        dp[i - 1][j - 1] // replace
                    )
                );
            }
        }
    }

    return dp[m][n];
}
```

</div>

This pattern of building a 2D table from base cases is exactly what Paytm interviewers want to see—systematic, clear, and correct.

[Practice Dynamic Programming at Paytm](/company/paytm/dynamic-programming)
