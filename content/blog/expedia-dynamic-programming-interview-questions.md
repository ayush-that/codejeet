---
title: "Dynamic Programming Questions at Expedia: What to Expect"
description: "Prepare for Dynamic Programming interview questions at Expedia — patterns, difficulty breakdown, and study tips."
date: "2029-06-02"
category: "dsa-patterns"
tags: ["expedia", "dynamic-programming", "interview prep"]
---

Dynamic Programming at Expedia isn't just another topic on a checklist; it's a critical filter. With 7 out of their 54 total tagged questions being DP, that's roughly 13% of their problem bank. In practice, this means you have a significant chance of encountering at least one DP question in your interview loop, especially for mid-to-senior backend or full-stack roles. Why? Expedia deals with massive, complex optimization problems daily: finding the cheapest flight itineraries across multiple airlines and dates, optimizing hotel package deals, scheduling resources. These are, at their core, dynamic programming problems. An interviewer isn't just testing if you can memorize the knapsack solution; they're probing your ability to break down a complex, real-world optimization constraint into an optimal substructure and overlapping subproblems. If you can't demonstrate that systematic thinking, you likely won't pass the technical bar.

## Specific Patterns Expedia Favors

Expedia's DP questions tend to cluster around practical optimization and sequence problems, not abstract mathematical puzzles. You'll rarely see exotic DP on trees or game theory. Instead, focus on these three core patterns:

1.  **1D/2D "Take or Skip" Decisions (Classic Knapsack):** This is their bread and butter. The problem will involve making a series of decisions (include a flight leg, select a hotel, use a coupon) with a constraint (budget, time, number of stops). The state is typically `(index, remaining_constraint)`.
    - **LeetCode Examples:** Perfect Squares (#279), Coin Change (#322), Partition Equal Subset Sum (#416). Coin Change is a quintessential Expedia-style problem: find the minimum number of coins (flights) to make an amount (reach a destination cost).

2.  **String/Sequence Alignment & Comparison:** This tests your ability to handle two sequences—think of comparing two travel itineraries, user query strings, or city codes. The state is usually `(i, j)` representing positions in two strings/arrays.
    - **LeetCode Examples:** Edit Distance (#72), Longest Common Subsequence (#1143). Edit Distance is highly relevant for any company dealing with search and data matching.

3.  **State Machine DP (Buy/Sell with Cooldown):** This is an advanced but favorite pattern for senior candidates. It models problems where your available actions depend on a previous state (e.g., you can't book a flight if you're in a "cooldown" period from a cancellation, or the classic stock trading with cooldown). The state is `(index, state)` where state could be `hold`, `sold`, `cooldown`.
    - **LeetCode Example:** Best Time to Buy and Sell Stock with Cooldown (#309).

Their implementation preference leans heavily toward **iterative, bottom-up tabulation**. They want to see clean, efficient, and space-optimized loops. While explaining the recursive relation is good, your final code should be the optimized DP table version.

## How to Prepare

The key is to internalize the framework, not just the solutions. For any DP problem, your thought process should be:

1.  Define the `dp` array/state. What does `dp[i][j]` represent?
2.  Define the base case(s). What's the smallest, trivial answer?
3.  Define the recurrence relation. How does `dp[i][j]` depend on previous states?
4.  Determine the iteration order. In what order must you fill the table?
5.  (Crucial) Space Optimization. Can you reduce a 2D table to 1D?

Let's look at the **Coin Change** pattern, optimized. The standard 2D DP is `dp[i][amount]`. But you can optimize it to 1D because you only need the previous row (for the "take" decision) and values earlier in the same row (for the "skip" decision).

<div class="code-group">

```python
def coinChange(coins, amount):
    # dp[x] = min coins to make amount x
    # Initialize with infinity, dp[0] = 0
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for coin in coins:  # Iterate over each coin type
        for x in range(coin, amount + 1):  # Iterate over all achievable amounts
            # Recurrence: min(skip this coin, take this coin + 1)
            dp[x] = min(dp[x], dp[x - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

# Time: O(A * C) where A = amount, C = number of coins
# Space: O(A) for the 1D dp array
```

```javascript
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) {
      dp[x] = Math.min(dp[x], dp[x - coin] + 1);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Time: O(A * C) | Space: O(A)
```

```java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // Use amount+1 as "infinity"
    dp[0] = 0;

    for (int coin : coins) {
        for (int x = coin; x <= amount; x++) {
            dp[x] = Math.min(dp[x], dp[x - coin] + 1);
        }
    }

    return dp[amount] > amount ? -1 : dp[amount];
}

// Time: O(A * C) | Space: O(A)
```

</div>

For **State Machine DP**, the pattern is distinct. Let's look at the skeleton for "Best Time to Buy and Sell Stock with Cooldown". You maintain multiple DP arrays representing different states.

<div class="code-group">

```python
def maxProfit(prices):
    if not prices:
        return 0

    n = len(prices)
    # State arrays
    hold = [0] * n      # Max profit if we HOLD a stock on day i
    sold = [0] * n      # Max profit if we SOLD a stock on day i
    rest = [0] * n      # Max profit if we are in REST/cooldown on day i

    # Base cases
    hold[0] = -prices[0]  # Buy on day 0
    sold[0] = float('-inf')  # Cannot sell on day 0
    rest[0] = 0

    for i in range(1, n):
        # Recurrence relations
        hold[i] = max(hold[i-1], rest[i-1] - prices[i])  # Hold previous or buy today from rest
        sold[i] = hold[i-1] + prices[i]                  # Sell the stock we were holding
        rest[i] = max(rest[i-1], sold[i-1])              # Rest or come from sold (cooldown)

    return max(sold[-1], rest[-1])  # Final state must be sold or rest, not hold

# Time: O(N) | Space: O(N) (can be optimized to O(1))
```

```javascript
function maxProfit(prices) {
  if (prices.length === 0) return 0;

  const n = prices.length;
  let hold = -prices[0];
  let sold = -Infinity;
  let rest = 0;

  for (let i = 1; i < n; i++) {
    const prevHold = hold;
    const prevSold = sold;
    const prevRest = rest;

    hold = Math.max(prevHold, prevRest - prices[i]);
    sold = prevHold + prices[i];
    rest = Math.max(prevRest, prevSold);
  }

  return Math.max(sold, rest);
}

// Time: O(N) | Space: O(1) - optimized version
```

```java
public int maxProfit(int[] prices) {
    if (prices.length == 0) return 0;

    int hold = -prices[0];
    int sold = Integer.MIN_VALUE;
    int rest = 0;

    for (int i = 1; i < prices.length; i++) {
        int prevHold = hold;
        int prevSold = sold;
        int prevRest = rest;

        hold = Math.max(prevHold, prevRest - prices[i]);
        sold = prevHold + prices[i];
        rest = Math.max(prevRest, prevSold);
    }

    return Math.max(sold, rest);
}

// Time: O(N) | Space: O(1)
```

</div>

## How Expedia Tests Dynamic Programming vs Other Companies

Expedia's DP questions sit in a sweet spot between FAANG and pure finance companies. Compared to Google or Meta, Expedia's problems are less about clever "aha!" insights and more about methodical application of known patterns to a business-logic wrapper. They won't ask something like "Dungeon Game" (#174) which requires reverse DP thinking. Compared to quant firms (like Jane Street), their problems are less mathematically dense and more grounded in operational scenarios.

The unique aspect is the **follow-up**. At Expedia, after you code the solution, expect a practical follow-up question: "How would this change if each 'coin' (flight) had an associated time duration as well as cost?" or "What if you could use each coupon only once?" They are testing if you truly understand the state definition and can modify it. This mirrors the real-world complexity of their systems.

## Study Order

Don't jump into hard problems. Build your DP intuition sequentially:

1.  **Fibonacci & Climbing Stairs (#70):** Understand the core concept of overlapping subproblems and memoization vs. tabulation.
2.  **1D Linear DP:** Problems like House Robber (#198). Learn to define `dp[i]` as the best answer up to index `i`.
3.  **Classic 0/1 Knapsack:** Start with the recursive decision tree, then build the 2D table, then optimize to 1D. Use Partition Equal Subset Sum (#416).
4.  **Unbounded Knapsack:** This is where Coin Change (#322) lives. Understand the subtle difference in the loop order compared to 0/1 knapsack.
5.  **2-Sequence DP:** Practice Longest Common Subsequence (#1143) and Edit Distance (#72). Master building the 2D table and deriving the recurrence from the characters/items being equal or not.
6.  **State Machine DP:** Tackle the Buy/Sell with Cooldown (#309) pattern. This solidifies your understanding of DP with multiple states.
7.  **Advanced Optimization:** Finally, look at problems where you can optimize space from O(n²) to O(n) or O(1), or where the state definition is non-obvious.

## Recommended Practice Order

Solve these Expedia-relevant problems in this sequence:

1.  Climbing Stairs (#70) - Warm-up
2.  Coin Change (#322) - Unbounded knapsack, minimum decision
3.  Partition Equal Subset Sum (#416) - 0/1 knapsack, existence check
4.  Perfect Squares (#279) - Unbounded knapsack application
5.  Longest Common Subsequence (#1143) - 2-sequence DP
6.  Edit Distance (#72) - 2-sequence DP with cost operations
7.  Best Time to Buy and Sell Stock with Cooldown (#309) - State machine

This order builds from foundational decision DP to sequence comparison, ending with the complex state management that senior roles are expected to handle.

[Practice Dynamic Programming at Expedia](/company/expedia/dynamic-programming)
