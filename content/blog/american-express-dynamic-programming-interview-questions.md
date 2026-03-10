---
title: "Dynamic Programming Questions at American Express: What to Expect"
description: "Prepare for Dynamic Programming interview questions at American Express — patterns, difficulty breakdown, and study tips."
date: "2031-03-20"
category: "dsa-patterns"
tags: ["american-express", "dynamic-programming", "interview prep"]
---

If you're preparing for an American Express technical interview, you'll likely face two coding questions. While the exact topics vary, data from our platform shows that **Dynamic Programming (DP) appears in roughly 8% of their technical interviews**. This means that for every 12 candidates, one will encounter a DP problem. It's not their most frequent topic—arrays and strings are more common—but it's a consistent, high-stakes component of their interview loop. Why? American Express deals heavily in transaction processing, fraud detection, and risk analysis—domains where optimization problems (like minimizing costs or maximizing efficiency within constraints) are paramount. A DP question tests your ability to break down a complex problem into optimal sub-structures, a skill directly applicable to designing efficient financial systems.

Don't treat this as a niche topic. When DP appears, it's often the harder of the two interview questions, designed to separate strong candidates from exceptional ones. Mastering it is crucial for advancing to the final rounds.

## Specific Patterns American Express Favors

American Express DP questions tend to avoid obscure, purely academic graph theory problems. Instead, they favor **classical one-dimensional and two-dimensional DP patterns** applied to practical scenarios. You're far more likely to see a problem about optimizing resource allocation (like coin change) or finding an optimal sequence (like longest increasing subsequence) than a complex DP on trees or graphs.

Their problems often fall into two camps:

1.  **Iterative (Tabulation) DP:** They frequently ask problems that are naturally solved by building a table from the bottom up. This approach is often more intuitive to explain in an interview setting and demonstrates clear, efficient thinking.
2.  **String/Sequence DP:** Problems involving comparing, matching, or transforming sequences (like edit distance or longest common subsequence) are common, as they model real-world tasks like data validation or pattern matching in transaction streams.

For example, you're more likely to see variations of these classic problems:

- **"Coin Change" (LeetCode #322):** Models minimizing the number of "operations" (coins) to reach a target (amount). Think of it as minimizing transaction fees or resource units.
- **"Longest Increasing Subsequence" (LeetCode #300):** Finding optimal ordered sequences within data is a core analytics task.
- **"House Robber" (LeetCode #198):** A classic 1D DP problem about making optimal decisions with constraints, analogous to selecting non-conflicting transactions or events.

Recursive DP with memoization is acceptable, but be prepared to also discuss or convert your solution to an iterative one. Interviewers want to see you understand the underlying state transition.

## How to Prepare

The key is pattern recognition. Don't memorize problems; learn to identify the "state" of the DP. Ask yourself: "What is the minimal information I need to know at step `i` to make an optimal decision for step `i+1`?"

Let's look at the most common pattern: **1D DP where `dp[i]` represents the best answer for the subproblem ending at or considering the first `i` elements.** The "House Robber" problem is the perfect archetype.

<div class="code-group">

```python
def rob(nums):
    """
    LeetCode #198. House Robber.
    DP State: dp[i] = max money robbable from the first i houses.
    Transition: At house i, we either rob it (add nums[i] to dp[i-2]) or skip it (take dp[i-1]).
    """
    if not nums:
        return 0
    n = len(nums)
    if n == 1:
        return nums[0]

    # dp array where dp[i] corresponds to nums[0...i-1]
    dp = [0] * (n + 1)
    dp[1] = nums[0]  # Base case: only the first house

    for i in range(2, n + 1):
        # i is 1-indexed for dp, so nums[i-1] is the current house value
        rob_current = nums[i-1] + dp[i-2]
        skip_current = dp[i-1]
        dp[i] = max(rob_current, skip_current)

    return dp[n]
# Time: O(n) | Space: O(n) (can be optimized to O(1) with two variables)
```

```javascript
function rob(nums) {
  if (!nums || nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];

  const n = nums.length;
  const dp = new Array(n + 1).fill(0);
  dp[1] = nums[0]; // Base case

  for (let i = 2; i <= n; i++) {
    const robCurrent = nums[i - 1] + dp[i - 2];
    const skipCurrent = dp[i - 1];
    dp[i] = Math.max(robCurrent, skipCurrent);
  }

  return dp[n];
}
// Time: O(n) | Space: O(n)
```

```java
public int rob(int[] nums) {
    if (nums == null || nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];

    int n = nums.length;
    int[] dp = new int[n + 1];
    dp[1] = nums[0]; // Base case

    for (int i = 2; i <= n; i++) {
        int robCurrent = nums[i - 1] + dp[i - 2];
        int skipCurrent = dp[i - 1];
        dp[i] = Math.max(robCurrent, skipCurrent);
    }

    return dp[n];
}
// Time: O(n) | Space: O(n)
```

</div>

Another critical pattern is **Unbounded Knapsack DP**, which powers the "Coin Change" solution. Here, the state is `dp[amount]`, and we iterate over coins for each amount.

<div class="code-group">

```python
def coinChange(coins, amount):
    """
    LeetCode #322. Coin Change.
    DP State: dp[a] = min coins to make amount `a`.
    Transition: For each coin, dp[a] = min(dp[a], 1 + dp[a - coin]).
    """
    # Initialize with a value larger than any possible answer (amount + 1)
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins to make amount 0

    for a in range(1, amount + 1):
        for coin in coins:
            if a - coin >= 0:
                dp[a] = min(dp[a], 1 + dp[a - coin])

    return dp[amount] if dp[amount] != amount + 1 else -1
# Time: O(amount * len(coins)) | Space: O(amount)
```

```javascript
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;

  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (a - coin >= 0) {
        dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
      }
    }
  }

  return dp[amount] === amount + 1 ? -1 : dp[amount];
}
// Time: O(amount * coins.length) | Space: O(amount)
```

```java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;

    for (int a = 1; a <= amount; a++) {
        for (int coin : coins) {
            if (a - coin >= 0) {
                dp[a] = Math.min(dp[a], 1 + dp[a - coin]);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}
// Time: O(amount * coins.length) | Space: O(amount)
```

</div>

## How American Express Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, American Express DP questions are generally **more structured and less "tricky."** At Google or Meta, you might get a problem that cleverly disguises a DP pattern (e.g., a game theory problem that reduces to DP). At American Express, the DP nature is often more apparent, but the evaluation is stringent on correctness, edge cases, and clarity of explanation.

The unique aspect is the **practical framing**. While a FAANG company might ask "Decode Ways" (LeetCode #91) as an abstract string problem, an American Express interviewer might contextualize it within decoding a sequence of transaction codes. The core algorithm is identical, but they appreciate you connecting the logic to a plausible business scenario. Your explanation should bridge the gap between the abstract pattern and its applied utility.

Difficulty-wise, expect problems in the **medium range** on LeetCode. You are unlikely to see a "hard" problem that requires advanced optimization (like DP with bitmasking), but the medium problems will test a deep, intuitive understanding of state definition and transition.

## Study Order

Tackle DP in this logical sequence to build a solid foundation:

1.  **Fibonacci & Climbing Stairs (LeetCode #70):** Learn the core concept of overlapping subproblems and memoization. This is DP in its simplest form.
2.  **1D Linear DP (House Robber - #198, Decode Ways - #91):** Master defining a single state `dp[i]` and writing a transition that looks back 1 or 2 steps. This is the most frequent pattern.
3.  **Unbounded Knapsack (Coin Change - #322):** Understand how to handle problems where you can reuse elements (coins). This introduces iterating the inner loop over items.
4.  **2D Sequence DP (Longest Common Subsequence - #1143, Edit Distance - #72):** Learn to define state as `dp[i][j]` for two sequences. This is critical for string comparison problems.
5.  **0/1 Knapsack (Partition Equal Subset Sum - #416):** Understand the classic bounded knapsack pattern. While slightly less common at Amex, it solidifies your understanding of decision-based DP.
6.  **DP on Intervals or Grids (Unique Paths - #62, Minimum Path Sum - #64):** These problems have clearer, sometimes mathematical, transitions and are excellent for practicing tabulation.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the concepts of the previous one.

1.  **Climbing Stairs (#70)** - Pure introduction.
2.  **House Robber (#198)** - Classic 1D decision DP.
3.  **Coin Change (#322)** - Unbounded knapsack / minimization DP.
4.  **Longest Increasing Subsequence (#300)** - 1D DP with an inner search (can introduce `O(n log n)` optimization discussion).
5.  **Decode Ways (#91)** - 1D DP with more complex state validation.
6.  **Longest Common Subsequence (#1143)** - Foundational 2D sequence DP.
7.  **Edit Distance (#72)** - More complex 2D sequence DP, a classic.
8.  **Partition Equal Subset Sum (#416)** - 0/1 Knapsack application.

Focus on writing clean, iterative solutions first. Always state the DP definition clearly before you code. At American Express, communicating your thought process is as important as getting the optimal solution.

[Practice Dynamic Programming at American Express](/company/american-express/dynamic-programming)
