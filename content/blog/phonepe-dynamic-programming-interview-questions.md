---
title: "Dynamic Programming Questions at PhonePe: What to Expect"
description: "Prepare for Dynamic Programming interview questions at PhonePe — patterns, difficulty breakdown, and study tips."
date: "2028-06-13"
category: "dsa-patterns"
tags: ["phonepe", "dynamic-programming", "interview prep"]
---

# Dynamic Programming Questions at PhonePe: What to Expect

PhonePe’s coding interview profile shows 31 Dynamic Programming (DP) questions out of 102 total—that’s roughly 30% of their problem bank. This isn’t a coincidence. PhonePe, handling India’s massive digital payment volume, builds systems where performance and optimal resource allocation are non-negotiable. Whether it’s minimizing transaction latency, optimizing cashback reward calculations, or efficiently routing payment requests, the underlying logic often maps directly to classic DP optimization problems. In interviews, DP isn’t just a “nice-to-have” topic; it’s a core filter for candidates applying for backend, data, and payments engineering roles. You should expect at least one medium-to-hard DP problem in most technical rounds, especially for roles above SDE-1.

## Specific Patterns PhonePe Favors

PhonePe’s DP questions tend to cluster around **real-world optimization scenarios** rather than abstract mathematical puzzles. The most frequent patterns are:

1.  **Knapsack & Subset Problems:** Modeling limited resource allocation—think distributing server load, optimizing batch processing jobs, or feature flag rollouts. Variations include 0/1 Knapsack, Unbounded Knapsack (Coin Change #322), and Partition Equal Subset Sum (#416).
2.  **String & Sequence DP:** Highly relevant for transaction ID validation, sequence matching in logs, or detecting patterns in user behavior. Longest Common Subsequence (#1143), Edit Distance (#72), and Longest Palindromic Subsequence (#516) are common.
3.  **State Machine DP:** Used for problems with clear state transitions, like tracking the status of a payment (initiated, processing, completed, failed) through various steps. Best Time to Buy and Sell Stock with Cooldown (#309) is a classic example.
4.  **Grid & Path DP:** Applied to problems involving movement through a grid or network, such as routing a payment through the least congested path or calculating risk scores across a matrix. Unique Paths (#62) and Minimum Path Sum (#64) are foundational, but expect twists.

They strongly favor **iterative (bottom-up) DP** solutions in interviews. While recursive with memoization is acceptable, interviewers will often push you to convert it to the iterative tabulation approach, as it’s generally more space-optimizable and aligns better with production code style for the problems they solve.

## How to Prepare

The key is to move beyond memorizing solutions and internalize the **framework for deriving the DP state**. For any DP problem, you must be able to articulate:

1.  What does `dp[i]` or `dp[i][j]` represent? (The state definition)
2.  What is the base case? (The smallest, simplest subproblem answer)
3.  What is the recurrence relation? (How does state `i` relate to states `i-1`, `i-2`, etc.?)
4.  What is the order of evaluation? (In which order do we fill the table to ensure needed subproblems are solved?)

Let’s look at the **Unbounded Knapsack** pattern, which appears in problems like Coin Change (#322). The standard 0/1 Knapsack restricts item use to once; the unbounded version allows infinite reuse, which changes the recurrence relation subtly.

<div class="code-group">

```python
# Coin Change (LeetCode #322) - Minimum number of coins to make amount
# Time: O(amount * len(coins)) | Space: O(amount)
def coinChange(coins, amount):
    # dp[i] = min coins to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins needed for amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                # Recurrence: try using this coin + solution for remaining amount
                dp[i] = min(dp[i], 1 + dp[i - coin])

    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
// Coin Change (LeetCode #322)
// Time: O(amount * coins.length) | Space: O(amount)
function coinChange(coins, amount) {
  // dp[i] = min coins to make amount i
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        // Recurrence relation
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
  }

  return dp[amount] !== Infinity ? dp[amount] : -1;
}
```

```java
// Coin Change (LeetCode #322)
// Time: O(amount * n) | Space: O(amount)
public int coinChange(int[] coins, int amount) {
    // dp[i] = min coins to make amount i
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // Use a value greater than any possible answer
    dp[0] = 0; // Base case

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                // Recurrence: 1 (this coin) + dp[remaining amount]
                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
            }
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}
```

</div>

Notice the pattern: we iterate through all amounts (`i` from 1 to target) and for each, try all possible choices (coins). The space is optimized to a 1D array because it’s an unbounded problem—we can reuse the same item multiple times, so we only need the current and previous states along one dimension.

## How PhonePe Tests Dynamic Programming vs Other Companies

Compared to FAANG companies, PhonePe’s DP questions are less about algorithmic trickery and more about **applied optimization**. At Google, you might get a DP problem disguised as a complex game theory or graph question. At PhonePe, the problem statement will often directly map to a payments or logistics scenario. The difficulty is similar to Amazon’s—medium on LeetCode scale, but with a focus on clean, efficient, and explainable code.

What’s unique is the **follow-up discussion**. After coding, be prepared to discuss:

- **Space optimization:** Can you reduce the DP table from 2D to 1D?
- **Edge cases:** What if the input size is enormous? How would you modify the approach?
- **Real-world analogy:** “How would this algorithm apply if coins were different API call latencies and the amount was a target response time?”

They test not just if you can solve it, but if you understand _why_ that solution is optimal for their domain.

## Study Order

Tackle DP in this sequence to build intuition progressively:

1.  **Foundation (1D DP):** Start with problems where the state is a single variable, like Fibonacci or Climbing Stairs (#70). This teaches the core concept of defining `dp[i]` and a recurrence.
2.  **Classic 0/1 Knapsack:** Learn the standard 2D DP for subset selection (Partition Equal Subset Sum #416). This introduces the concept of a second dimension (capacity/weight).
3.  **Unbounded Knapsack & Variations:** Move to Coin Change (#322) and Coin Change 2 (#518). This teaches you how the recurrence and iteration order change when items can be reused.
4.  **String DP:** Tackle Longest Common Subsequence (#1143) and Edit Distance (#72). This is crucial for sequence matching problems common at PhonePe.
5.  **Grid & Path DP:** Solve Unique Paths (#62) and Minimum Path Sum (#64). These are straightforward but form the basis for more complex matrix problems.
6.  **State Machine DP:** Finally, attempt the Buy/Sell Stock series, especially with cooldown (#309). This pattern is powerful for modeling finite state processes.

This order works because each step introduces one new complexity layer (adding a dimension, changing item reuse, moving to two sequences, adding state transitions) without overwhelming you.

## Recommended Practice Order

Solve these specific problems in sequence. Each builds on the previous pattern:

1.  Climbing Stairs (#70) – 1D DP, simple recurrence.
2.  House Robber (#198) – 1D DP with a slightly more complex decision (rob/skip).
3.  Partition Equal Subset Sum (#416) – Classic 0/1 Knapsack introduction.
4.  Coin Change (#322) – Unbounded Knapsack (minimum number of items).
5.  Coin Change 2 (#518) – Unbounded Knapsack (number of combinations).
6.  Longest Common Subsequence (#1143) – Fundamental 2D string DP.
7.  Edit Distance (#72) – Essential string DP with practical applications.
8.  Unique Paths (#62) – Basic 2D grid DP.
9.  Minimum Path Sum (#64) – Grid DP with costs.
10. Best Time to Buy and Sell Stock with Cooldown (#309) – State Machine DP.

After this core set, you’ll have the patterns needed to tackle most of PhonePe’s DP questions. Remember to always implement the iterative version first and discuss space optimization.

[Practice Dynamic Programming at PhonePe](/company/phonepe/dynamic-programming)
